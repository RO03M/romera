import { Kernel } from "../kernel";
import type { Process, ProcessWorker } from "../process/process";
import { isSyscallStream } from "../process/types";

export function linkWorkerToProcess(worker: ProcessWorker, process: Process) {
    process.worker = worker;

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
}

export function workerMessageHandler(process: Process, data: unknown) {
    if (process.worker === undefined) {
        throw new Error("Process has no worker attached");
    }

    if (typeof data !== "object" || data === null) {
        return;
    }

    if ("kill" in data) {
        process.kill();
        return;
    }

    if ("opcode" in data && data.opcode === "stdout" && "content" in data) {
        process.stdout.write(data.content);
        return;
    }

    if ("opcode" in data && data.opcode === "stdin" && "content" in data) {
        process.stdin.write(data.content);
        return;
    }

    if (!isSyscallStream(data)) {
        return;
    }

    const { args, method, syscallId, type } = data;

    const response = Kernel.instance().syscall(method, ...args);

    response
        .then((value) => {
            process.worker!.postMessage({
                type: "SYSCALL_RESPONSE",
                id: syscallId,
                response: value,
                code: 1
            });
        })
        .catch((error) => {
            // ADD stderr
            Kernel.instance().syscall("echo", error);
            process.kill();
        });
}
