import { Filesystem, MemoryBackend } from "@romos/fs";
import { Kernel } from "../kernel";
import { NodeWorkerManager } from "../worker/node-worker-manager";
import { buildFs } from "../internal/build-default-fs";

export function setupKernel() {
    const kernel = Kernel.instance();

    kernel.filesystem = new Filesystem("mock", { backend: new MemoryBackend() });
    kernel.threadManager = new NodeWorkerManager();
    kernel.ttyManager.terminals.set(-1, {
        echo: (message) => console.log(`CUSTOM ECHO: ${message}`),
        workingDirectory: "/"
    });
    
    buildFs();
}

setupKernel();