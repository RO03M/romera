import { Filesystem, format, normalize, type ReadFileOptions } from "@romos/fs";
import { TTYManager } from "./tty-manager";
import { Scheduler } from "./process/scheduler";

export class Kernel {
	public filesystem: Filesystem;
	public scheduler: Scheduler;
	public ttyManager: TTYManager;

	private static _instance: Kernel;

	constructor() {
		this.filesystem = new Filesystem("rome-os-fs");
		this.filesystem.init();

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

	// TODO algumas funções aqui são desnecessárias e não fazem sentido estarem no "syscalls"
	// Por exemplo a função pathFormat, esse caralho poderia estar em um arquivo importado pelo o worker ou algo assim
	public syscall(method: string, cwd: string, tty: number) {
		// biome-ignore lint/complexity/noBannedTypes: <explanation>
		const methods: Record<string, Function> = {
			stat: (filepath: string) => this.filesystem.stat(filepath),
			lstat: (filepath: string) => this.filesystem.lstat(filepath),
			readdir: (filepath: string) => this.filesystem.readdir(filepath),
			readFile: async (filepath: string, options?: ReadFileOptions) =>
				await this.filesystem.readFile(filepath, options),
			normalize: (filepath: string) => normalize(filepath),
			createProcess: (command: string, args: string[] = []) =>
				this.scheduler.exec(command, args, {
					cwd,
					tty
				}),
			// create_proc_default_rgui: createWindowProcessFromProgramTable,
			exec: (command: string, args: string[], tty: number) =>
				this.scheduler.exec(command, args, {
					tty
				}),
			pwd: () => cwd,
			echo: (message: string) =>
				this.ttyManager.terminals.get(tty)?.echo(message),
			free: () => {},
			lock: () => {},
			mkdir: (filepath: string) => this.filesystem.mkdir(filepath),
			writeFile: (filepath: string, content: string | Uint8Array) =>
				this.filesystem.writeFile(filepath, content),
			pathFormat: (root: string, base: string) => format({ root, base })
		};

		if (method in methods) {
			return methods?.[method] ?? null;
		}
	}
}
