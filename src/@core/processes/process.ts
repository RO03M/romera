import type { ComponentType } from "preact";
import { filesystem, processScheduler } from "../../app";
import type { ReadFileOptions } from "../filesystem/types";
import { format, normalize } from "../filesystem/utils/path";
import { useTTYStore } from "../system/tty";
import { incrementalId } from "../utils/incremental-id";
import { safe } from "../utils/safe";
import { RScriptTranslator } from "./rscript-translator";
import {
	isSyscallStream,
	type SyscallMethod,
	type ProcessOptions,
	type ProcessComponentProps
} from "./types";
import { isMagicProgram, programTable } from "../../programs/program-table";

export const MAGIC_SPAWN_CMD = "magic-spawn";

export class Process {
	public readonly pid: number;
	public readonly ppid: number | null;
	public readonly uid: number;
	public readonly command: string;
	public readonly args: string[];
	public readonly tty: number | undefined;
	public stat: number;

	public Component?: ComponentType<ProcessComponentProps>;
	public componentArgs?: ProcessComponentProps;
	private readonly options: ProcessOptions;
	private worker?: Worker;

	constructor(command: string, args?: string[], options?: ProcessOptions) {
		this.pid = incrementalId("process");
		this.command = command;
		this.args = args ?? [];
		this.ppid = null;
		this.uid = 0;
		this.tty = options?.tty;
		this.stat = 0;
		this.options = options ?? {};
	}

	/**
	 * @description creates and attaches a worker to the current process
	 */
	public start() {
		if (this.isMagicSpawn()) {
			this.invokeComponent();
			return;
		}
		const path = this.resolveCommandPath();

		const content = filesystem.readFile(path, { decode: true });

		if (content === null || typeof content !== "string") {
			// Should I throw an error here?
			this.terminate();
			return;
		}

		const rscriptTranslator = new RScriptTranslator(content, this.args);
		rscriptTranslator.cookScript();
		const scriptBlobURL = rscriptTranslator.generateBlob();

		const methods = this.syscallMethods();

		this.worker = new Worker(scriptBlobURL, {
			name: `process-${this.pid}`
		});

		this.worker.onerror = () => {
			this.terminate();
		};

		this.worker.onmessage = ({ data }) => {
			if (data === 0) {
				this.terminate();
				return;
			}

			if (isSyscallStream(data)) {
				const { method, args, responseId } = data;
				if (typeof method !== "string") {
					return;
				}

				if (!(method in methods)) {
					this.worker?.postMessage({
						type: "SYSCALL_RESPONSE",
						id: responseId,
						response: "SYSCALL_NOT_FOUND"
					});
					return;
				}

				const methodTyped = method as keyof typeof methods;
				if (
					methods[methodTyped] === undefined ||
					typeof methods[methodTyped] !== "function"
				) {
					this.worker?.postMessage({
						type: "SYSCALL_RESPONSE",
						id: responseId,
						response: "SYSCALL_METHOD_NOT_READY"
					});
				} else {
					const response = safe(() =>
						methods[methodTyped].bind(null, ...args)()
					);

					if (response.error) {
						this.worker?.postMessage({
							type: "SYSCALL_RESPONSE",
							id: responseId,
							response: response.error.message,
							status: 0
						});
						return;
					}

					const treatedResponse =
						response.data === undefined
							? ""
							: JSON.parse(JSON.stringify(response.data));

					this.worker?.postMessage({
						type: "SYSCALL_RESPONSE",
						id: responseId,
						response: treatedResponse,
						status: 1
					});
				}

				return;
			}
		};
	}

	public terminate() {
		const ttyContext = this.getTTY();
		this.options.onTerminate?.();
		this.worker?.terminate();
		ttyContext?.free();
	}

	private invokeComponent() {
		if (!this.isMagicSpawn()) {
			throw new Error("Process is not a magic spawn");
		}

		const [componentName, wdir, title] = this.args;
		if (isMagicProgram(componentName)) {
			this.Component = programTable[componentName];
			this.componentArgs = {
				title,
				workingDirectory: wdir
			};
		}
	}

	private isMagicSpawn() {
		if (
			this.command !== MAGIC_SPAWN_CMD ||
			this.args.length === 0 ||
			!isMagicProgram(this.args[0])
		) {
			return false;
		}

		return true;
	}

	private syscallMethods(): Record<string, SyscallMethod> {
		const ttyContext = this.getTTY();

		return {
			stat: (filepath: string) => filesystem.stat(filepath),
			lstat: (filepath: string) => filesystem.lstat(filepath),
			readdir: (filepath: string) => filesystem.readdir(filepath),
			readFile: (filepath: string, options?: ReadFileOptions) =>
				filesystem.readFile(filepath, options),
			normalize: (filepath: string) => normalize(filepath),
			// create_proc_default_rgui: createWindowProcessFromProgramTable,
			exec: (command: string, args: string[], tty: number) =>
				processScheduler.exec(command, args, {
					tty
				}),
			pwd: () => this.options.cwd,
			echo: (message: string) => ttyContext?.echo(message),
			free: () => ttyContext?.free(),
			lock: () => ttyContext?.lock(),
			mkdir: (filepath: string) => filesystem.mkdir(filepath),
			pathFormat: (root: string, base: string) => format({ root, base })
		};
	}

	private getTTY() {
		if (this.tty === undefined) {
			return this.tty;
		}

		return useTTYStore.getState().getTTY(this.tty);
	}

	private resolveCommandPath() {
		const shouldSearchBin = !/^(\/|\.\/|\.\.\/)/.test(this.command);
		if (shouldSearchBin) {
			return `/bin/${this.command}`;
		}

		return format({ base: this.command, root: this.options.cwd ?? "/" });
	}
}
