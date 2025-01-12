import { Filesystem, format } from "@romos/fs";

type TerminateCallback = (process: Process) => void;

export interface ProcessOptions {
    command: string;
    tty: string | null;
    args?: string[];
    ppid?: number; 
    cwd?: string;
    timeout?: number;
    onTerminate?: TerminateCallback;
}

export class Process {
    public readonly pid: number;
    public readonly ppid: number | null;
    public readonly tty: string | null;
    public readonly command: string;
    public readonly cwd: string;
    public readonly args: string[];

    private worker?: Worker;
    private blobURL?: string;
    private onTerminate?: TerminateCallback;

    constructor(options: ProcessOptions) {
        this.pid = -1;
        this.command = options.command;
        this.ppid = options.ppid ?? null;
        this.tty = options.tty;
        this.cwd = options.cwd ?? "/";
        this.args = options.args ?? [];
        this.onTerminate = options.onTerminate;
    }

    public terminate() {
		this.onTerminate?.(this);
		this.worker?.terminate();

		if (this.blobURL !== undefined && URL) {
			URL.revokeObjectURL(this.blobURL);
		}
	}

    public async start() {

    }

    private resolveCommandPath() {
		const shouldSearchBin = !/^(\/|\.\/|\.\.\/)/.test(this.command);
		if (shouldSearchBin) {
			return `/bin/${this.command}`;
		}

		return format({ base: this.command, root: this.cwd ?? "/" });
	}
}