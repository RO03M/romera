import "fake-indexeddb/auto";
import { describe, expect, it, vi } from "vitest";
import { Filesystem } from "./filesystem";

const filesystem = new Filesystem("fs-unit-tests");

describe("Filesystem general node operations", () => {
	describe("directory", () => {
		it("Should be able to find the root directory stat", () => {
			const stat = filesystem.stat("/");
			expect(stat).toBeDefined();
		});
	
		it("Should be able to create a directory", () => {
			filesystem.mkdir("/teste");
			const stat = filesystem.stat("/teste");
	
			expect(stat).not.toBeNull();
	
			filesystem.mkdir("/teste/teste");
		});
	
		it("Should be able to create nest create", () => {
			filesystem.mkdir("/nested/directory/test", { parents: true });
			const stat = filesystem.stat("/nested/directory/test");

			expect(stat).not.toBeNull();
		});

		it("Should be able to remove a directory", () => {
			filesystem.mkdir("/tmp");
			expect(filesystem.stat("/tmp")).not.toBeNull();
	
			filesystem.rmdir("/tmp");
			expect(filesystem.stat("/tmp")).toBeNull();
		});
	});

	it("Should be able to create file with writeFile", () => {
		filesystem.mkdir("/bin");
		filesystem.writeFile("/bin/test", "file created from unit test");

		expect(filesystem.stat("/bin/test")).not.toBeNull();
	});

	describe("file", () => {
		it("Should be able to read file as a buffer", async () => {
			const file = await filesystem.readFile("/bin/test");
			expect(file).toBeDefined();
			expect(file instanceof Uint8Array).toBeTruthy();
		});
	
		it("Should be able to read file and return the content decoded", async () => {
			const file = await filesystem.readFile("/bin/test", { decode: true });
			expect(file).toBeDefined();
			expect(typeof file).toBe("string");
		});
	});
	describe("Rename", () => {
		it("Should be able to rename a file", async () => {
			filesystem.mkdir("/renamefile");
			await filesystem.writeFile("/renamefile/oldName.sh", "content");
			const oldStat = filesystem.stat("/renamefile/oldName.sh");

			filesystem.rename("/renamefile/oldName.sh", "newName.foo");
			const newStat = filesystem.stat("/renamefile/newName.foo");

			expect(newStat).not.toBeNull();
			expect(oldStat?.inode).toBe(newStat?.inode);

			expect(filesystem.stat("/renamefile/oldName.sh")).toBeNull();

			expect(await filesystem.readFile("/renamefile/newName.foo", { decode: true })).toBe("content");
		});
	});

	describe("Symlinks", () => {
		it("Should be able to create a symbolic link", () => {
			filesystem.symlink("/bin", "/randomlink");
			const stat = filesystem.lstat("/randomlink");

			expect(stat).not.toBeNull();
		});

		it("The symlink stat should return the target directory", () => {
			filesystem.symlink("/bin", "/binlink");
			const linkStat = filesystem.stat("/binlink");
			const binStat = filesystem.stat("/bin");

			expect(linkStat).toEqual(binStat);

			filesystem.symlink("/teste/teste", "/bin/ttlink");
			expect(filesystem.stat("/teste/teste")).toEqual(filesystem.stat("/bin/ttlink"));
		});

		it("Should work with files", async () => {
			filesystem.mkdir("/swwf-test");
			const swwftxt = "Hello from symlink";
			filesystem.writeFile("/swwf-test/swwf.txt", swwftxt);
			filesystem.symlink("/swwf-test/swwf.txt", "/swwf-test/filelink");

			expect(filesystem.lstat("/swwf-test/filelink")).not.toBeNull();
			const content = await filesystem.readFile("/swwf-test/filelink", { decode: true });

			expect(content).toBe(swwftxt);
		});

		it("Should work with relative paths", () => {
			filesystem.mkdir("/bin/symlink-relative-path-dir");
			filesystem.mkdir("/bin/teste");
			filesystem.symlink("../../symlink-relative-path-dir", "/bin/teste/relative-link");

			expect(filesystem.lstat("/bin/teste/relative-link")).not.toBeNull();
			expect(filesystem.stat("/bin/teste/relative-link")).toEqual(filesystem.stat("/bin/symlink-relative-path-dir"));
		});
	});

	describe("watch events", () => {
		it("Should be able to subscribe to events", async () => {
			const callback = vi.fn(() => {});

			filesystem.watch("/home/romera/desktop", callback);
			filesystem.mkdir("/home/romera/desktop", { parents: true });
			await filesystem.writeFile("/home/romera/desktop/watch1", "watch 1");

			expect(callback).toBeCalledTimes(2); // created and changed when created the watch1 file
			expect(callback).toHaveBeenCalledWith("created")
			expect(callback).toHaveBeenCalledWith("change")
		});

		it("Should be able to subscribe twice or more to one single path", () => {
			const callback1 = vi.fn(() => {});
			const callback2 = vi.fn(() => {});

			filesystem.watch("/watchtest2", callback1);
			filesystem.watch("/watchtest2", callback2);
			filesystem.mkdir("/watchtest2");

			expect(callback1).toHaveBeenCalledWith("created");
			expect(callback2).toHaveBeenCalledWith("created");
		});
	});
});
