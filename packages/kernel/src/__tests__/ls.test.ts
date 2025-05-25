import { describe, expect, test, vi } from "vitest";
import { Kernel } from "../kernel";
import { waitpid } from "../process/waitpid";

describe("LS command", async () => {
    test("ls spawn", async () => {
        const process = await Kernel.instance().scheduler.exec("pwd", []);
        const echoSpy = vi.spyOn(Kernel.instance().ttyManager.terminals.get(-1)!, "echo");
        await waitpid(process.pid);
        expect(echoSpy).toHaveBeenCalledWith("/");
    });
});