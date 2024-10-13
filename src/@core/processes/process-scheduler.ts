import type { programTable } from "../../programs/program-table";
import { type WatchCallback, Watcher } from "../utils/watcher";
import { MAGIC_SPAWN_CMD, Process } from "./process";
import type { ProcessOptions } from "./types";

type ProcessEvent = "created" | "ran" | "slept" | "killed";

export class ProcessScheduler {
	public readonly concurrencyLimit = navigator?.hardwareConcurrency ?? 4;
	private watcher = new Watcher<ProcessEvent, "all" | number>();
	private running: Map<Process["pid"], Process> = new Map();
	private sleeping: Map<Process["pid"], Process> = new Map();

	public exec(command: string, args?: string[], options?: ProcessOptions) {
		const process = new Process(command, args, {
			...options,
			onTerminate: () => {
				this.kill(process.pid);
			}
		});

		this.sleeping.set(process.pid, process);
		this.watcher.emit("all", "created");
		this.watcher.emit(process.pid, "created");
	}

	public kill(pid: Process["pid"]) {
		this.sleeping.delete(pid);
		this.running.delete(pid);
		this.watcher.emit("all", "killed");
		this.watcher.emit(pid, "killed");
	}

	public spawnMagicWindow(
		componentName: keyof typeof programTable,
		cwd: string
	) {
		this.exec(MAGIC_SPAWN_CMD, [componentName, cwd]);
	}

	public *tick() {
		while (true) {
			for (const processItem of this.sleeping) {
				if (this.running.size >= this.concurrencyLimit) {
					break;
				}

				const [pid, process] = processItem;

				this.running.set(pid, process);
				this.sleeping.delete(pid);
				process.start();
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

	public get processes() {
		return [...this.running.values(), ...this.sleeping.values()];
	}
}
