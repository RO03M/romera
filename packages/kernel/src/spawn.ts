import { Kernel } from "./kernel";
import { ProcessOptions } from "./process/process";

export async function spawn(command: string, args: string[], options?: Omit<ProcessOptions, "command" | "args">) {
    return await Kernel.instance().scheduler.exec(command, args, options);
}