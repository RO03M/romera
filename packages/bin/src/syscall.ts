import "fake-indexeddb/auto";
import { Filesystem, MemoryBackend } from "@romos/fs";
import { Kernel } from "@romos/kernel";

const kernel = Kernel.instance();
kernel.filesystem = new Filesystem("mock", { backend: new MemoryBackend() });
kernel.ttyManager.terminals.set(-1, {
    echo: console.log,
    workingDirectory: "/"
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function syscall(method: string, ...args: any[]) {
    return await kernel.syscall(method, ...args);
}

global.syscall = syscall;