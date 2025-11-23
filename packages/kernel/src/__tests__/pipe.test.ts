import { describe, it } from "vitest";
import { spawn } from "../spawn";
import { waitpid } from "../process/waitpid";
import { Kernel } from "../kernel";

describe("Process piping", async () => {
    it("Should be able to pass the output from the 1st process to the input of the 2nd", async () => {
        const firstProcess = await spawn("ls", []);
        const secondProcess = await spawn("cat", []);
        firstProcess.stdout.pipe(secondProcess.stdin);
        // Kernel.instance().scheduler.watch(secondProcess.pid, ["ran"], () => {
        //     secondProcess.stdin.write("teste");
        //     // firstProcess.stdout.write("teste");
        // });

        await waitpid(firstProcess.pid);
        await waitpid(secondProcess.pid);
    });
});