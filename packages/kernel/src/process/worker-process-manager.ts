import { safe } from "@romos/utils";
import { Kernel } from "../kernel";
import { RScriptTranslator } from "./rscript-translator";
import { isSyscallStream } from "./types";
import type { Process } from "./process";
import type { ThreadManager } from "../thread-manager";

export class WorkerProcessManager implements ThreadManager {
	private worker!: Worker;
	private url!: string;

	async spawn(process: Process) {
		const content = await Kernel.instance().filesystem.readFile(
			process.resolvedPath,
			{ decode: true }
		);

		console.log(await Kernel.instance().filesystem.getJSON());
		if (content === null) {
			process.terminate();

			return;
		}

		const rscriptTranslator = new RScriptTranslator(content, process);
		rscriptTranslator.cookScript();
		this.url = rscriptTranslator.generateBlob();

		this.worker = new Worker(this.url, {
			name: `process-${process.pid}`
		});

		this.worker.onerror = (error) => {
			console.error("[WORKER-PROCESS-MANAGER]: ", error);
			this.terminate();
		};

		this.worker.onmessage = ({ data }) => {
			if (data.kill) {
				this.terminate();
				process.terminate();
				return;
			}
			console.log(data);

			if (!isSyscallStream(data)) {
				return;
			}

			const { args, method, syscallId, type } = data;
			console.log(method);
			const response = Kernel.instance().syscall(method, ...args);
			response
				.then((value) => {
					console.log(value, method);
					this.postMessage({
						type: "SYSCALL_RESPONSE",
						id: syscallId,
						response: value,
						code: 1
					});
				})
				.catch((error) => {
					Kernel.instance().syscall("echo", error);
					process.terminate();
					this.terminate();
				});
			// const foo = Kernel.instance().syscall(method, process.cwd, process.tty);

			// if (foo === null) {
			//     this.worker?.postMessage({
			//         type: "SYSCALL_RESPONSE",
			//         id: responseId,
			//         response: "SYSCALL_METHOD_NOT_READY"
			//     });
			//     return;
			// }

			// const response = safe(() => foo?.bind(null, ...args)());

			// if (response.error) {
			//     this.worker?.postMessage({
			//         type: "SYSCALL_RESPONSE",
			//         id: responseId,
			//         response: response.error.message,
			//         status: 0
			//     });
			//     return;
			// }

			// if (response.data instanceof Promise) {
			//     response.data.then((res) => {
			//         const treatedResponse =
			//             res === undefined
			//                 ? ""
			//                 : JSON.parse(JSON.stringify(res));
			//         this.worker?.postMessage({
			//             type: "SYSCALL_RESPONSE",
			//             id: responseId,
			//             response: treatedResponse,
			//             status: 1
			//         });
			//     });
			// } else {
			//     const treatedResponse =
			//         response.data === undefined
			//             ? ""
			//             : JSON.parse(JSON.stringify(response.data));

			//     this.worker?.postMessage({
			//         type: "SYSCALL_RESPONSE",
			//         id: responseId,
			//         response: treatedResponse,
			//         status: 1
			//     });
			// }
		};
	}

	public postMessage(message: unknown, options?: StructuredSerializeOptions) {
		this.worker.postMessage(message, options);
	}

	public terminate() {
		this.worker.terminate();
		if (this.url !== undefined && URL) {
			URL.revokeObjectURL(this.url);
		}
	}
}
