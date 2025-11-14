import type { Stat } from "@romos/fs";
import { echo as _echo } from "../std/echo";
import { pwd as _pwd } from "../std/pwd";

const echo = _echo;
const pwd = _pwd;

export async function main(dirname: string) {
    if (!dirname) {
        await echo("Missing dir name");
        exit();
    }

    const cwd = await pwd();

    await syscall("exec", "component", ["monaco", "monaco", `${cwd}/${dirname}`], proc.tty);
}

export const code = main;
