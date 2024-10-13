import { Process } from "./process";
import type { ProcessOptions } from "./types";

export class ProcessScheduler {
	public running: Map<Process["pid"], Process> = new Map();
	public sleeping: Map<Process["pid"], Process> = new Map();
	public readonly concurrencyLimit = navigator?.hardwareConcurrency ?? 4;

	public exec(command: string, args?: string[], options?: ProcessOptions) {
		const process = new Process(command, args, {
			...options,
			onTerminate: () => {
				this.kill(process.pid);
			}
		});

		this.sleeping.set(process.pid, process);
	}

	public kill(pid: Process["pid"]) {
		this.sleeping.delete(pid);
		this.running.delete(pid);
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
			}

			yield {
				running: this.running.size,
				sleeping: this.sleeping.size
			};
		}
	}
}
