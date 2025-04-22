import { safe } from "@romos/utils";
import { Kernel } from "../kernel";
import { RScriptTranslator } from "./rscript-translator";
import { isSyscallStream } from "./types";
import type { Process } from "./process";

export class WorkerProcessManager {
	private worker: Worker;
	public readonly url: string;

	constructor(processRef: Process, content: string) {
		const rscriptTranslator = new RScriptTranslator(content, processRef.pid, processRef.args);
		rscriptTranslator.cookScript();
		this.url = rscriptTranslator.generateBlob();

		this.worker = new Worker(this.url, {
			name: `process-${processRef.pid}`
		});

		this.worker.onerror = (error) => {
			console.error("[WORKER-PROCESS-MANAGER]: ", error);
			this.terminate();
		};

		this.worker.onmessage = ({ data }) => {
			if (data.kill) {
				this.terminate();
                processRef.terminate();
				return;
			}

			if (!isSyscallStream(data)) {
				return;
			}

			const { args, method, responseId, type } = data;

			// const foo = Kernel.instance().syscall(method, processRef.cwd, processRef.tty);

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
