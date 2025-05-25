import { Filesystem, format } from "@romos/fs";
import { Kernel } from "../kernel";
import type { BrowserWorkerManager } from "../worker/browser/browser-worker-manager";
import { Watcher } from "@romos/utils";
import { Stream } from "../stream/stream";

type TerminateCallback = (process: Process) => void;

export interface ProcessOptions {
	command: string;
	tty: number;
	args?: string[];
	ppid?: number;
	cwd?: string;
	timeout?: number;
	onTerminate?: TerminateCallback;
}

export class Process {
	public readonly pid: number;
	public readonly ppid: number | null;
	public readonly tty: number;
	public readonly command: string;
	public readonly cwd: string;
	public readonly args: string[];
	public readonly resolvedPath: string;
	public stdout = new Stream();
	public stdin = new Stream();

	private workerProcessManager?: BrowserWorkerManager;
	private onTerminate?: TerminateCallback;
	private watcher = new Watcher<string, number>();

	constructor(pid: number, options: ProcessOptions) {
		this.pid = pid;
		this.command = options.command;
		this.ppid = options.ppid ?? null;
		this.tty = options.tty;
		this.cwd = options.cwd ?? "/";
		this.args = options.args ?? [];
		this.resolvedPath = this.resolveCommandPath();
		this.onTerminate = options.onTerminate;
	}

	public terminate() {
		this.onTerminate?.(this);
		this.workerProcessManager?.terminate();
		this.watcher.emit(this.pid, "killed");
	}

	public on(event: string, callback: VoidFunction) {
		this.watcher.watch(this.pid, event, callback);
	}

	public off(event: string, callback: VoidFunction) {
		this.watcher.unwatch(this.pid, event, callback);
	}

	// public stdin(buffer: unknown, options?: StructuredSerializeOptions) {
	// 	this.workerProcessManager?.postMessage(buffer, options);
	// }

	// public stdout() {
		
	// }

	public pipe(process: Process) {

	}

	private resolveCommandPath() {
		const shouldSearchBin = !/^(\/|\.\/|\.\.\/)/.test(this.command);
		if (shouldSearchBin) {
			return `/bin/${this.command}`;
		}

		return format({ base: this.command, root: this.cwd ?? "/" });
	}
}
