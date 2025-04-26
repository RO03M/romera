import { echo as _echo } from "../std/echo";
import { pwd as _pwd } from "../std/pwd";

const echo = _echo;
const pwd = _pwd;

async function main(filename: string) {
    const cwd = await pwd();
    const filepath = await syscall("normalize", `${cwd}/${filename}`);

    const stat = await syscall("stat", filepath);

    if (stat === null) {
        await echo(`cat: ${filename}: No such file or directory`);
        exit();
    }
    const content = await syscall("readFile", filepath, { decode: true });

    await echo(content);
}

export const cat = main;