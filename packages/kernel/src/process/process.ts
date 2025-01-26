import { Filesystem, format } from "@romos/fs";
import { Kernel } from "../kernel";
import { WorkerProcessManager } from "./worker-process-manager";

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

    private workerProcessManager?: WorkerProcessManager;
    private onTerminate?: TerminateCallback;

    constructor(pid: number, options: ProcessOptions) {
        this.pid = pid;
        this.command = options.command;
        this.ppid = options.ppid ?? null;
        this.tty = options.tty;
        this.cwd = options.cwd ?? "/";
        this.args = options.args ?? [];
        this.onTerminate = options.onTerminate;
    }

    public terminate() {
		this.onTerminate?.(this);
		this.workerProcessManager?.terminate();
	}

    public async start() {
        if (this.command === "component") {
            return;
        }

        const path = this.resolveCommandPath();

        const content = await Kernel.instance().filesystem.readFile(path, { decode: true });

        if (content === null || typeof content !== "string") {
			// Should I throw an error here?
			this.terminate();
			return;
		}

        this.workerProcessManager = new WorkerProcessManager(this, content);
    }

    private resolveCommandPath() {
		const shouldSearchBin = !/^(\/|\.\/|\.\.\/)/.test(this.command);
		if (shouldSearchBin) {
			return `/bin/${this.command}`;
		}

		return format({ base: this.command, root: this.cwd ?? "/" });
	}
}