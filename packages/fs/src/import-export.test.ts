import { describe, expect, it } from "vitest";
import { Filesystem } from "./filesystem";
import { MemoryBackend } from "./backend/memory-backend";

const dirs = ["/bin", "/bin/foo", "/home", "/usr", "/usr/test"];

describe("Export and import filesystem data", async () => {
    const file = new Uint8Array([1, 2, 3, 4]);

    const filesystem = new Filesystem("test", { backend: new MemoryBackend() });

    for (const dir of dirs) {
        filesystem.mkdir(dir);
    }

    await filesystem.writeFile("/bin/file", file);
    filesystem.symlink("/bin/file", "/link");

    let exportData: Uint8Array;

    it("Should be able to export the filesystem", async () => {
        exportData = await filesystem.export();

        expect(exportData).toBeInstanceOf(Uint8Array);
    });

    it("Should be able to import to a new filesystem instance", async () => {
        const newfs = new Filesystem("newfs", { backend: new MemoryBackend() });

        await newfs.import(exportData);

        for (const dir of dirs) {
            const stat = newfs.stat(dir);

            expect(stat).not.toBeNull()
            expect(stat?.type).toBe("dir");
        }

        const filecontent = await newfs.readFile("/bin/file");

        expect(filecontent).toStrictEqual(file);

        const linkstat = newfs.lstat("/link");

        expect(linkstat?.type).toBe("symlink");
        expect(linkstat?.target).toBe("/bin/file");
        expect((newfs as any).iused).toBe((filesystem as any).iused);
    });
})