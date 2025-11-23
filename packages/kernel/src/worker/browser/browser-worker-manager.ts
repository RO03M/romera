import { Kernel } from "../../kernel";
import { injectScript } from "./injector";
import type { Process } from "../../process/process";
import type { WorkerBackend } from "../backend";
import { linkWorkerToProcess, workerMessageHandler } from "../worker-handlers";

export class BrowserWorkerManager implements WorkerBackend {
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

		linkWorkerToProcess(worker, process)

		worker.onerror = (error) => {
			console.error("[WORKER-PROCESS-MANAGER]: ", error);
			process.kill();
		};

		worker.onmessage = ({ data }) => {
			workerMessageHandler(process, data);
		};
	}
}
