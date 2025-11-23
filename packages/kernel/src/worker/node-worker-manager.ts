import { Worker } from "node:worker_threads";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { buildSyscall } from "./syscall";
import { buildStd } from "../bin/std/build-std";
import { Kernel, type Process, type ThreadManager } from "..";
import { Stream } from "../stream/stream";

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

		const workerCode = `
import { parentPort } from "node:worker_threads";
const self = parentPort;

const args = [${process.args.map((arg) => `"${arg}"`)}];

const proc = {
    pid: ${process.pid},
    ppid: ${process.ppid},
    tty: ${process.tty}
};

${Stream.toString()}

const os = {
	stdin: new Stream(),
	stdout: new Stream()
};

os.stdin.on("data", (data) => {
	self.postMessage({
		opcode: "stdin",
		content: data
	});
});

os.stdout.on("data", (data) => {
	self.postMessage({
		opcode: "stdout",
		content: data
	});
});

${buildStd()}

function exit(code = 0, message = "") {
    self.postMessage({ code, message, kill: true });
}

${buildSyscall("node")}

${content}

const stdout = await main(...args);

exit(0, stdout);
        `;

		writeFileSync(tmpFilePath, workerCode);

		const worker = new Worker(tmpFilePath);

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

		worker.on("error", (error) => {
			console.log("error", error);
		});

		worker.on("message", (data) => {
			if ("kill" in data) {
				worker.terminate();
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

			const { args, method, syscallId, type } = data;

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
					worker.terminate();
				});
		});
	}
}
