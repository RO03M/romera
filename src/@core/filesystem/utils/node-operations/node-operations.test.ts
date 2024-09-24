import { describe, expect, it } from "vitest";
import { doActionOnNode } from "./do-action-on-node";
import { mockFilesystem } from "../test-data";
import type { Node } from "../../node";
import { updateNodeFromTree } from "./update-node-from-tree";
import { findNodeFromTree } from "../find-node-from-tree";

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
			const [result, foundNode] = doActionOnNode("/bin/ls", mockFilesystem, (node) => {
                node.content = "changed";
                const foundNode = { ...node };
                foundNode.content = "can't change me";

                return foundNode;
			});
            
            expect(result).toBeDefined();
            expect(foundNode).toBeDefined();
            expect(result?.nodes?.[0]?.nodes?.[0].content).toBe("changed");
            expect(mockFilesystem?.nodes?.[0]?.nodes?.[0].content).toBe("ls file");
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
