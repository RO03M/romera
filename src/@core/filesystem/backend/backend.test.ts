import "fake-indexeddb/auto";
import { expect, it } from "vitest";
import { FSBackend } from "./backend";
import type { FSMap } from "../filesystem";
import { Stat } from "../stat";

const backend = new FSBackend();

it("Should be able to save and load a superblock", async () => {
	const data: FSMap = new Map([["root", new Stat("dir", 1, 1)]]);

	await backend.saveSuperblock(data);
    expect(await backend.loadSuperblock()).toEqual(data);
});

it("Should be able to save to the inode table", async () => {
    const buffer1 = new Uint8Array([1, 2, 3, 4]);
    const buffer2 = new Uint8Array([5, 6, 7, 8]);

    await backend.writeFile(1, buffer1);
    await backend.writeFile(2, buffer2);

    expect(await backend.readFile(1)).toEqual(buffer1);
    expect(await backend.readFile(2)).toEqual(buffer2);
});
