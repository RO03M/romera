import { describe, it } from "vitest";
import { spawn } from "../spawn";
import { waitpid } from "../process/waitpid";

describe("Process piping", async () => {
    it("Should be able to pass the output from the 1st process to the input of the 2nd", async () => {
        const firstProcess = await spawn("ls", []);
        firstProcess.stdin.push("teste2");
        await waitpid(firstProcess.pid);
    });
});