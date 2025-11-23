import { echo as _echo } from "../std/echo";
import { pwd as _pwd } from "../std/pwd";

const echo = _echo;
const pwd = _pwd;

async function main(filename: string) {
    async function getFilepath(filename: string) {
        if (filename.startsWith("/")) {
            const filepath = await syscall("normalize", filename);
            return filepath;
        }

        const cwd = await pwd();
        const filepath = await syscall("normalize", `${cwd}/${filename}`);

        return filepath;
    }

    if (!filename) {
        console.log("before stdin read");
        const stdin = await os.stdin.read();
        console.log("after stdin read", stdin);
        // await echo(stdin.join(""));
        print(stdin.join(""));

        return;
    }

    const filepath = await getFilepath(filename);
    const stat = await syscall("stat", filepath);

    if (stat === null) {
        await echo(`cat: ${filename}: No such file or directory`);
        exit();
    }
    const content = await readFile(filepath as string, { decode: true });

    if (typeof content !== "string") {
        print(`Invalid content from filepath: ${filepath}`);

        return;
    }

    print(content);
    // await echo(content);
}

export const cat = main;