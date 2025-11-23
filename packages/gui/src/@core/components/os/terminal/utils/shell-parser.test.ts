import { describe, expect, it } from "vitest";
import { ShellParser } from "./shell-parser";

describe("Shell parser suit tests", () => {
    it("Should be able to parse a pipeline command", () => {
        const sh = new ShellParser();

        sh.parse("ls -la /etc | grep conf | sort -u");

        expect(sh.output).toStrictEqual({
            type: "pipeline",
            commands: [
                {
                    program: "ls",
                    args: ["-la", "/etc"]
                },
                {
                    program: "grep",
                    args: ["conf"]
                },
                {
                    program: "sort",
                    args: ["-u"]
                }
            ]
        });
    });

    it("Should be able to parse simple commands", () => {
        const sh = new ShellParser();

        sh.parse("echo hello");

        expect(sh.output).toStrictEqual({
            type: "command",
            commands: [
                {
                    program: "echo",
                    args: ["hello"]
                }
            ]
        });
    });
});