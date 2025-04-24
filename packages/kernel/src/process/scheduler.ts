import { type WatchCallback, Watcher } from "@romos/utils";
import { Process, type ProcessOptions } from "./process";
import { Kernel } from "../kernel";

type ProcessEvent = "created" | "ran" | "slept" | "killed";

interface SchedulerOptions {
    concurrency?: number;
}

export class Scheduler {
    public readonly concurrency: number;

    private watcher = new Watcher<ProcessEvent, "all" | number>();
	private running: Map<Process["pid"], Process> = new Map();
	private sleeping: Map<Process["pid"], Process> = new Map();

    constructor(options: SchedulerOptions) {
        this.concurrency = options.concurrency ?? 4;
    }


    public exec(command: string, args: string[], options?: Omit<ProcessOptions, "command" | "args">) {
		const process = new Process(this.generatePid(), {
            command,
            args,
			tty: options?.tty ?? -1,
			...options,
			onTerminate: () => {
				this.kill(process.pid);
			}
		});

		this.sleeping.set(process.pid, process);
		this.watcher.emit("all", "created");
		this.watcher.emit(process.pid, "created");

		return process;
	}

    public kill(pid: Process["pid"]) {
		this.sleeping.delete(pid);
		this.running.delete(pid);
		this.watcher.emit("all", "killed");
		this.watcher.emit(pid, "killed");
		this.watcher.events.delete(pid); // Should I do this?

		const children = this.processes.filter((process) => process.ppid === pid);

		for (const child of children) {
			this.kill(child.pid);
		}
	}

    public *tick() {
		while (true) {
			for (const processItem of this.sleeping) {
				// if (this.running.size >= this.concurrency) {
				// 	break;
				// }

				const [pid, process] = processItem;

				this.running.set(pid, process);
				this.sleeping.delete(pid);
				// process.start();
				Kernel.instance().threadManager.spawn(process);
				this.watcher.emit("all", "ran");
				this.watcher.emit(pid, "ran");
			}

			yield {
				running: this.running.size,
				sleeping: this.sleeping.size
			};
		}
	}

	public watch(
		key: "all" | number,
		events: ProcessEvent[],
		callback: WatchCallback<ProcessEvent>
	) {
		for (const event of events) {
			this.watcher.watch(key, event, callback);
		}
	}

	public async waitpid(pid: number) {
		return new Promise((resolve) => {
			this.watcher.watch(pid, "killed", () => {
				resolve(pid);
			});
		});
	}

	public get processes() {
		return [...this.running.values(), ...this.sleeping.values()];
	}

	private generatePid() {
        let pid: number;
        do {
            pid = Math.floor(Math.random() * 65535)
        } while (this.running.has(pid) || this.sleeping.has(pid));

		return pid;
    }
}