import type { ComponentType } from "preact";
import { filesystem, processScheduler, terminalManager } from "../../app";
import { isMagicProgram, programTable } from "../../programs/program-table";
import type { ReadFileOptions } from "../filesystem/types";
import { format, normalize } from "../filesystem/utils/path";
import { incrementalId } from "../utils/incremental-id";
import { safe } from "../utils/safe";
import { RScriptTranslator } from "./rscript-translator";
import {
	type ProcessComponentProps,
	type ProcessOptions,
	type SyscallMethod,
	isSyscallStream
} from "./types";

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
	private blobUrl: string | undefined;
	private _stdout: unknown;

	constructor(
		command: string,
		args?: string[],
		options?: ProcessOptions,
		ppid: number | null = null
	) {
		this.pid = incrementalId("process");
		this.ppid = ppid;
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
	public async start() {
		if (this.isMagicSpawn()) {
			this.invokeComponent();
			return;
		}
		const path = this.resolveCommandPath();

		const content = await filesystem.readFile(path, { decode: true });

		if (content === null || typeof content !== "string") {
			// Should I throw an error here?
			this.terminate();
			return;
		}

		const rscriptTranslator = new RScriptTranslator(content, this.args);
		rscriptTranslator.cookScript();
		const scriptBlobURL = rscriptTranslator.generateBlob();

		const methods = this.syscallMethods();

		this.blobUrl = scriptBlobURL;

		this.worker = new Worker(scriptBlobURL, {
			name: `process-${this.pid}`
		});

		this.worker.onerror = (error) => {
			this.getTTY()?.echo(error.message ?? "Something went wrong");
			this.terminate();
		};

		this.worker.onmessage = ({ data }) => {
			if (data.kill) {
				this._stdout = data.message;
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
					const foo = methods[methodTyped];
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

					// Código pedaço de carniça, jogar todo esse lixo fora e fazer de uma forma melhor, de preferência com uma lib separada para o "kernel" dessa desgraça
					if (response.data instanceof Promise) {
						response.data.then((res) => {
							const treatedResponse =
								res === undefined
									? ""
									: JSON.parse(JSON.stringify(res));
							this.worker?.postMessage({
								type: "SYSCALL_RESPONSE",
								id: responseId,
								response: treatedResponse,
								status: 1
							});
						});
					} else {
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
				}

				return;
			}
		};
	}

	public get stdout() {
		return this._stdout;
	}

	public terminate() {
		this.options.onTerminate?.();
		this.worker?.terminate();
		// ttyContext?.free();
		if (this.blobUrl !== undefined) {
			URL.revokeObjectURL(this.blobUrl);
		}
	}

	private invokeComponent() {
		if (!this.isMagicSpawn()) {
			throw new Error("Process is not a magic spawn");
		}

		const [componentName, wdir, title] = this.args;
		if (isMagicProgram(componentName)) {
			this.Component = programTable[componentName];
			this.componentArgs = {
				pid: this.pid,
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
			readFile: async (filepath: string, options?: ReadFileOptions) =>
				await filesystem.readFile(filepath, options),
			normalize: (filepath: string) => normalize(filepath),
			createProcess: (command: string, args: string[] = []) =>
				processScheduler.exec(command, args, {
					cwd: this.options.cwd,
					tty: this.options.tty
				}),
			// create_proc_default_rgui: createWindowProcessFromProgramTable,
			exec: (command: string, args: string[], tty: number) =>
				processScheduler.exec(command, args, {
					tty
				}),
			pwd: () => this.options.cwd,
			echo: (message: string) => ttyContext?.echo(message),
			free: () => {},
			lock: () => {},
			mkdir: (filepath: string) => filesystem.mkdir(filepath),
			writeFile: (filepath: string, content: string | Uint8Array) =>
				filesystem.writeFile(filepath, content),
			pathFormat: (root: string, base: string) => format({ root, base })
		};
	}

	private getTTY() {
		if (this.tty === undefined) {
			return this.tty;
		}

		return terminalManager.terminals.get(this.tty);
	}

	private resolveCommandPath() {
		const shouldSearchBin = !/^(\/|\.\/|\.\.\/)/.test(this.command);
		if (shouldSearchBin) {
			return `/bin/${this.command}`;
		}

		return format({ base: this.command, root: this.options.cwd ?? "/" });
	}
}
