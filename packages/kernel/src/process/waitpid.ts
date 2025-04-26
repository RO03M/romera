import { Kernel } from "../kernel";

export async function waitpid(pid: number) {
    const process = Kernel.instance().scheduler.processes.get(pid);

    if (!process) {
        return;
    }

    return new Promise<void>((resolve) => {
        process.on("killed", resolve);
    });
}