import { describe, expect, it } from "vitest";
import { doActionOnNode } from "./do-action-on-node";
import { mockFilesystem } from "../test-data";
import type { Node } from "../../node";
import { updateNodeFromTree } from "./update-node-from-tree";
import { findNodeFromTree } from "../find-node-from-tree";
import { createNodeOnTree } from "./create-node-on-tree";
import { normalize } from "../path";

describe("Filesystem general node operations", () => {
	describe("Do action on node", () => {
		it("Should be able to find a directory node", () => {
			const [_, dir] = doActionOnNode("/bin", mockFilesystem, (node) => {
				return node;
			});

			expect(dir).toBeDefined();
			expect(dir).toHaveProperty("name", "/bin");
			expect(dir).toHaveProperty("type", "directory");
			expect(dir!.name).toBe("/bin");
		});

		it("Should be able to find a file node", () => {
			const [_, file] = doActionOnNode("/bin/ls", mockFilesystem, (node) => {
				return node;
			});

			expect(file).toBeDefined();
			expect(file).toHaveProperty("name", "/ls");
			expect(file).toHaveProperty("type", "file");
		});

		it("Should be able to find the node and do something with it", () => {
			const [result, foundNode] = doActionOnNode(
				"/bin/ls",
				mockFilesystem,
				(node) => {
					if (node.type !== "file") {
						return null;
					}

					node.content = "changed";
					const foundNode = { ...node };
					foundNode.content = "can't change me";

					return foundNode;
				}
			);

			expect(result).toBeDefined();
			expect(foundNode).toBeDefined();
			expect(findNodeFromTree("/bin/ls", result)).toHaveProperty(
				"content",
				"changed"
			);
			expect(findNodeFromTree("/bin/ls", mockFilesystem)).toHaveProperty(
				"content",
				"ls file"
			);
			expect(foundNode?.content).toBe("can't change me");
		});
	});

	describe("Find node method", () => {
		it("Should be able to find a directory", () => {
			const node = findNodeFromTree("/bin", mockFilesystem);

			expect(node).toBeDefined();
			expect(node).toHaveProperty("name", "/bin");
			expect(node).toHaveProperty("type", "directory");
		});

		it("Should be able to find a file", () => {
			const node = findNodeFromTree("/bin/cat", mockFilesystem);

			expect(node).toBeDefined();
			expect(node).toHaveProperty("name", "/cat");
			expect(node).toHaveProperty("type", "file");
		});
	});

	describe("Create node method", () => {
		describe("Success cases! Happy life", () => {
			it("Should be able to create a file in the root dir", () => {
				const newFile: Omit<Node, "id"> = {
					name: "newNode",
					type: "file"
				};

				const result = createNodeOnTree("/", mockFilesystem, newFile);

				expect(result.nodeTree).toBeDefined();

				const newNodeInNodeTree = findNodeFromTree(
					"/newNode",
					result.nodeTree!
				);

				expect(newNodeInNodeTree).toBeDefined();
				expect(newNodeInNodeTree).toHaveProperty(
					"name",
					normalize(newFile.name)
				);
			});

			it("Should be able to create a file in any directory", () => {
				const newFile: Omit<Node, "id"> = {
					name: "/mkdir",
					type: "file"
				};

				const result = createNodeOnTree("/bin", mockFilesystem, newFile);

				expect(result.status).toBeTruthy();
				expect(result.nodeTree).toBeDefined();
				expect(findNodeFromTree("/bin/mkdir", result.nodeTree!)).toBeDefined();
			});

			it("Should be able to create a directory in any directory", () => {
				const newFile: Omit<Node, "id"> = {
					name: "./romera2",
					type: "directory"
				};

				const result = createNodeOnTree("/home", mockFilesystem, newFile);

				expect(result.status).toBeTruthy();
				expect(result.nodeTree).toBeDefined();
				expect(
					findNodeFromTree("/home/romera2", result.nodeTree!)
				).toBeDefined();
			});
		});

		describe("Error cases", () => {
			it("Should return a error if the provided path doesn't exist", () => {
				const file: Omit<Node, "id"> = {
					name: "/mkdir",
					type: "file"
				};

				const { status, message } = createNodeOnTree(
					"/randompaththatdoesntexist",
					mockFilesystem,
					file
				);

				expect(status).toBeFalsy();
				expect(message).toBe("INVALID_PARENT_PATH");
			});

			it("Should return error if the provided path is of a file", () => {
				const file: Omit<Node, "id"> = {
					name: "/mkdir",
					type: "file"
				};

				const { status, message } = createNodeOnTree(
					"/bin/ls",
					mockFilesystem,
					file
				);

				expect(status).toBeFalsy();
				expect(message).toBe("PARENT_NODE_IS_NOT_A_DIRECTORY");
			});

			it("Should return error if there is already an existing node in that path (same type and name)", () => {
				const file: Omit<Node, "id"> = {
					name: "/ls",
					type: "file"
				};

				const { status, message } = createNodeOnTree(
					"/bin",
					mockFilesystem,
					file
				);

				expect(status).toBeFalsy();
				expect(message).toBe("NODE_ALREAD_EXISTS");
			});
		});
	});

	describe("Update node content method", () => {
		it("Should be able to update a file", () => {
			const value = "changed value from hello";
			const result = updateNodeFromTree("/home/hello", mockFilesystem, value);
			const node = findNodeFromTree("/home/hello", result);

			expect(node).toBeDefined();
			expect(node).toHaveProperty("content", value);
		});
	});
});
