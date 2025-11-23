import { Worker } from "node:worker_threads";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { Kernel, type Process, type ThreadManager } from "..";
import { compile, CompileTarget } from "./browser/injector";
import { linkWorkerToProcess, workerMessageHandler } from "./worker-handlers";

export class NodeWorkerManager implements ThreadManager {
	async spawn(process: Process): Promise<void> {
		const content = await Kernel.instance().filesystem.readFile(
			process.resolvedPath,
			{ decode: true }
		);
		if (content === null) {
			process.terminate();

			return;
		}

		const tmpFilePath = join(tmpdir(), `worker-${randomUUID()}.js`);

		const workerCode = 
`
import { parentPort } from "node:worker_threads";
const self = parentPort;

${compile(process, content, CompileTarget.NodeJS)}
`;

		writeFileSync(tmpFilePath, workerCode);

		const worker = new Worker(tmpFilePath);

		linkWorkerToProcess(worker, process);

		worker.on("error", (error) => {
			console.log("error", error);
			process.kill();
		});

		worker.on("message", (data) => {
			workerMessageHandler(process, data);
		});
	}
}
