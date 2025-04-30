import type { ReadFileOptions, Stat } from "@romos/fs";

export async function stat(filepath: string): Promise<Stat | null> {
	return await syscall("stat", filepath);
}

export async function writeFile(filepath: string, content: string | Uint8Array): Promise<void> {
    return await syscall("writeFile", filepath, content);
}

export async function readFile(filepath: string, options?: ReadFileOptions): Promise<string | Uint8Array | null> {
    return await syscall("readFile", filepath, options);
}
