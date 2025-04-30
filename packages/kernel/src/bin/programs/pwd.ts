import { echo as _echo } from "../std/echo";
import { pwd as _pwd } from "../std/pwd";

const pwd = _pwd;
const echo = _echo;

export async function main() {
    const cwd = await pwd();

    await echo(cwd);
}

export const prog_pwd = main;