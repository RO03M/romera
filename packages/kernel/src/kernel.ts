import { Filesystem, type ReadFileOptions, format, normalize } from "@romos/fs";
import { Scheduler } from "./scheduler/scheduler";
import { TTYManager } from "./tty-manager";
import type { WorkerBackend } from "./worker/backend";
import { BrowserWorkerManager } from "./worker/browser/browser-worker-manager";
import { Network } from "@romos/network";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type SyscallHandler = (...args: any[]) => unknown;

export class Kernel {
	public filesystem: Filesystem;
	public scheduler: Scheduler;
	public ttyManager: TTYManager;
	public threadManager: WorkerBackend;
	public readonly network: Network

	private static _instance: Kernel;
	private syscallMap = new Map<string, SyscallHandler>();

	constructor() {
		this.setupSyscalls();
		this.filesystem = new Filesystem("rome-os-fs");
		this.threadManager = new BrowserWorkerManager();
    this.network = new Network();

		// this.filesystem.init();

		this.scheduler = new Scheduler({
			concurrency: 4 // TODO add dynamic concurrency limit
		});

		setInterval(() => {
			this.scheduler.tick().next();
		}, 0);

		this.ttyManager = new TTYManager();
	}

	public static instance() {
		if (Kernel._instance === undefined) {
			Kernel._instance = new Kernel();
		}

		return Kernel._instance;
	}

	private setupSyscalls() {
		this.syscallMap.set("stat", (filepath: string) =>
			this.filesystem.stat(filepath)
		);
		this.syscallMap.set("lstat", (filepath: string) =>
			this.filesystem.lstat(filepath)
		);
		this.syscallMap.set("readdir", (filepath: string) =>
			this.filesystem.readdir(filepath)
		);
		this.syscallMap.set(
			"readFile",
			(filepath: string, options?: ReadFileOptions) =>
				this.filesystem.readFile(filepath, options)
		);
		this.syscallMap.set("normalize", (filepath: string) => normalize(filepath));
		this.syscallMap.set(
			"createProcess",
			(
				command: string,
				args: string[] = [],
				ppid?: number,
				cwd?: string,
				tty?: number
			) => {
				this.scheduler.exec(command, args, { cwd, tty: tty ?? -1, ppid });
			}
		);
		this.syscallMap.set(
			"fork",
			(
				command: string,
				args: string[] = [],
				ppid?: number,
				cwd?: string,
				tty?: number
			) => {
				return this.scheduler.exec(command, args, { cwd, tty: tty ?? -1, ppid });
			}
		);
		this.syscallMap.set(
			"exec",
			(command: string, args: string[], tty: number) =>
				this.scheduler.exec(command, args, { tty })
		);
		this.syscallMap.set("echo", (message: string, tty: number) =>
			this.ttyManager.terminals.get(tty)?.echo(message)
		);
		this.syscallMap.set("mkdir", (filepath: string) =>
			this.filesystem.mkdir(filepath)
		);
		this.syscallMap.set(
			"writeFile",
			(filepath: string, content: string | Uint8Array) =>
				this.filesystem.writeFile(filepath, content)
		);
		this.syscallMap.set(
			"pwd",
			(pid: number) => this.scheduler.processes.get(pid)?.cwd
		);
		this.syscallMap.set("pathFormat", (root: string, base: string) => format({ root, base }));
		
		this.syscallNetwork();
	}
	
	private syscallNetwork() {
    	this.syscallMap.set("sys_connect", async (targetIp: string) => {
            await this.network.connect(targetIp);
    	});
     
        this.syscallMap.set("sys_sendto", async (ip: string, data: unknown) => {
            await this.network.sendTo(ip, data)
        });
        // this.syscallMap.set("sys_recv")
        // this.syscallMap.set("sys_recvfrom")
	}

	// TODO algumas funções aqui são desnecessárias e não fazem sentido estarem no "syscalls"
	// Por exemplo a função pathFormat, esse caralho poderia estar em um arquivo importado pelo o worker ou algo assim
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public async syscall(method: string, ...args: any[]) {
		const handler = this.syscallMap.get(method);
		if (!handler) {
			throw new Error(`Syscall ${method} not found`);
		}
		const result = handler(...args);
		return result instanceof Promise ? await result : result;
	}
}
