import { Kernel } from "../../kernel";
import { injectScript } from "./injector";
import { isSyscallStream } from "../../process/types";
import type { Process } from "../../process/process";
import type { WorkerBackend } from "../backend";

export class BrowserWorkerManager implements WorkerBackend {
	// private worker!: Worker;
	// private url!: string;

	async spawn(process: Process) {
		const content = await Kernel.instance().filesystem.readFile(
			process.resolvedPath,
			{ decode: true }
		);

		if (content === null) {
			process.terminate();

			return;
		}

		const url = injectScript(content, process);

		const worker = new Worker(url, {
			name: `process-${process.pid}`
		});

		process.stdin.on("pipe", (data) => {
			worker.postMessage({
				type: "stdin",
				value: data
			});
		});

		process.stdout.on("pipe", (data) => {
			worker.postMessage({
				type: "stdout",
				value: data
			});
		});

		worker.onerror = (error) => {
			console.error("[WORKER-PROCESS-MANAGER]: ", error);
			// this.terminate();
		};

		worker.onmessage = ({ data }) => {
			if (data.kill) {
				// this.terminate();
				process.terminate();
				return;
			}

			if ("opcode" in data && data.opcode === "stdout") {
				process.stdout.write(data.content);
				return;
			}

			if ("opcode" in data && data.opcode === "stdin") {
				return;
			}

			if (!isSyscallStream(data)) {
				return;
			}

			const { args, method, syscallId } = data;

			const response = Kernel.instance().syscall(method, ...args);
			response
				.then((value) => {
					worker.postMessage({
						type: "SYSCALL_RESPONSE",
						id: syscallId,
						response: value,
						code: 1
					});
				})
				.catch((error) => {
					Kernel.instance().syscall("echo", error);
					process.terminate();
					// this.terminate();
				});
		};
	}

	// public postMessage(message: unknown, options?: StructuredSerializeOptions) {
	// 	this.worker.postMessage(message, options);
	// }

	// public terminate() {
	// 	this.worker.terminate();
	// 	if (this.url !== undefined && URL) {
	// 		URL.revokeObjectURL(this.url);
	// 	}
	// }
}
