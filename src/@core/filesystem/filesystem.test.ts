import { describe, expect, it } from "vitest";
import { Filesystem } from "./filesystem";
import { normalize } from "./utils/path";

describe("Filesystem general node operations", () => {
	const filesystem = Filesystem.singleton();

	describe("Find node method", () => {
		it("Should be able to find a directory", () => {
			const node = filesystem.findNode("/bin");

			expect(node).not.toBeNull();
			expect(node).toHaveProperty("name", "/bin");
			expect(node).toHaveProperty("type", "directory");
		});

		it("Should be able to find a file", () => {
			const node = filesystem.findNode("/bin/cat");

			expect(node).not.toBeNull();
			expect(node).toHaveProperty("name", "/cat");
			expect(node).toHaveProperty("type", "file");
		});
	});

	describe("Create node method", () => {
		describe("Success cases! Happy life", () => {
			describe("Default options", () => {
				it("Should be able to create a file in the root dir", () => {
					const result = filesystem.createNode("/", "newNode", "file");
					const node = filesystem.findNode("/newNode");

					expect(result).toHaveProperty("status", true);
					expect(node).not.toBeNull();
				});

				it("Should be able to create a file in any directory", () => {
					const result = filesystem.createNode("/bin", "newNode", "file");
					const node = filesystem.findNode("/bin/newNode");

					expect(result).toHaveProperty("status", true);
					expect(node).not.toBeNull();
				});

				it("Should be able to create a directory in any directory", () => {
					filesystem.createNode("/home", "romera2", "directory");
					const node = filesystem.findNode("/home/romera2");

					expect(node).not.toBeNull();
				});

				it("Should create be able to create a node without being in the directory", () => {
					const dirName = "nestedCreation";
					const path = `/home/romera/${dirName}`;
					filesystem.createNode("/", path, "directory");
					const node = filesystem.findNode(path);

					expect(node).not.toBeNull();
					expect(node).toHaveProperty("name", normalize(dirName));
				});
			});
			describe("Custom options", () => {
				describe("Make parents", () => {
					it("It should be able to create multiple directories with a single input", () => {
						const result = filesystem.createNode("/path/path2/path3/path4", "path5", "directory", { makeParents: true });
						const node = filesystem.findNode("/path/path2/path3/path4/path5");

						expect(result).toHaveProperty("status", true);
						expect(node).not.toBeNull();
					});

					it("Should be able to create a file using nested node creation", () => {
						const result = filesystem.createNode("/home", "/dirtestcase1/file", "file", { makeParents: true });
						const node = filesystem.findNode("/home/dirtestcase1/file");

						expect(result).toHaveProperty("status", true);
						expect(node).not.toBeNull();
					});
				});
			});
		});

		describe("Error cases", () => {
			describe("Default options", () => {
				it("Should return a error if the provided path doesn't exist", () => {
					const { status, message } = filesystem.createNode(
						"/randompaththatdoesntexist",
						"mkdir",
						"file"
					);

					expect(status).toBeFalsy();
					expect(message).toBe("INVALID_PARENT_PATH");
				});

				it("Should return error if the provided path is of a file", () => {
					const { status, message } = filesystem.createNode(
						"/bin/ls",
						"mkdir",
						"file"
					);

					expect(status).toBeFalsy();
					expect(message).toBe("PARENT_NODE_IS_NOT_A_DIRECTORY");
				});

				it("Should return error if there is already an existing node in that path (same type and name)", () => {
					const { status, message } = filesystem.createNode(
						"/bin",
						"ls",
						"file"
					);

					expect(status).toBeFalsy();
					expect(message).toBe("NODE_ALREADY_EXISTS");
				});

				it("Should return error if a directory doesn't exist and we try to create a file to it using nested creation", () => {
					const dirName = "nestedCreation";
					const path = `/home/directorythatdoesntexist/${dirName}`;
					const result = filesystem.createNode("/", path, "directory");

					expect(result).toHaveProperty("status", false);
					expect(result).toHaveProperty("message", "INVALID_PARENT_PATH");
				});
			});
		});
	});

	describe("Update node content method", () => {
		it("Should be able to update a file", () => {
			const value = "changed value from hello";
			filesystem.createNode("/", "file2change", "file");
			filesystem.updateNode("/file2change", value);
			const node = filesystem.findNode("/file2change");

			expect(node).not.toBeNull();
			expect(node).toHaveProperty("content", value);
		});
	});
});
