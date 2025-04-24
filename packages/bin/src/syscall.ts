import "fake-indexeddb/auto";
import { Filesystem, MemoryBackend } from "@romos/fs";
import { Kernel } from "@romos/kernel";
import { NodeWorkerManager } from "./node-worker-manager";
import { parentPort } from "node:worker_threads";

const kernel = Kernel.instance();
kernel.filesystem = new Filesystem("mock", { backend: new MemoryBackend() });
kernel.threadManager = new NodeWorkerManager();
kernel.ttyManager.terminals.set(-1, {
    echo: (message) => console.log(`CUSTOM ECHO: ${message}`),
    workingDirectory: "/"
});

// const { parentPort } = require('node:worker_threads');
const self = parentPort;

const queue = new Map<string, (value: unknown) => void>();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function syscall(method: string, ...args: any[])  {
    const syscallId = (Math.random() + 1).toString(36).substring(7);
    self!.postMessage({
        type: "SYSCALL",
        method,
        args,
        syscallId
    });

    const promise = new Promise((resolve) => {
        queue.set(syscallId, resolve)
    });

    return promise
}

// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// export async function syscall(method: string, ...args: any[]) {
//     return await kernel.syscall(method, ...args);
// }

// global.syscall = syscall;