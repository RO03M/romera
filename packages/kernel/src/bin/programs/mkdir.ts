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
	const resolvedPath = await syscall("pathFormat", cwd, dirname);

	await syscall<Promise<Stat>>("mkdir", resolvedPath).catch(async () => {
		await echo("Cannot create dir ");
		exit();
	});
}

export const mkdir = main;
