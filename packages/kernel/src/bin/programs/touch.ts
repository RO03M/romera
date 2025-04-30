import { echo as _echo } from "../std/echo";
import { writeFile as _writeFile } from "../std/fs/fs";
import { format as _format } from "../std/fs/path-format";
import { pwd as _pwd } from "../std/pwd";

const echo = _echo;
const pwd = _pwd;
const writeFile = _writeFile;
const format = _format;

async function main(filename: string) {
    if (!filename) {
        await echo("touch: missing file operand");
        exit();
    }

    const cwd = await pwd();
    const resolvedPath = await format(cwd, filename);
    await writeFile(resolvedPath, "").catch(async () => {
        await echo(`touch: cannot create file ${filename}`);
    });
}

export const touch = main;