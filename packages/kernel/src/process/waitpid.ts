import { Kernel } from "../kernel";

export async function waitpid(pid: number) {
    // Forma horrível para fazer isso, mas são quase meia noite ent fdas-e
    const process = Kernel.instance().scheduler.processes.find((process) => process.pid === pid);

    if (!process) {
        return;
    }

    return new Promise<void>((resolve) => {
        process.on("killed", resolve);
    });
}