import { describe, expect, it } from "vitest";
import type { Node } from "../node";
import { getPathFromNode } from "./get-path-from-node";

const mockFilesystem: Node = {
	id: 1,
	name: "/",
	type: "directory",
	nodes: [
		{
			id: 2,
			name: "/bin",
			type: "directory",
			nodes: [
				{
					id: 3,
					type: "file",
					name: "/ls",
					content: "ls file"
				},
				{
					id: 4,
					type: "file",
					name: "/cat",
					content: "cat file"
				}
			]
		},
		{
			id: 5,
			name: "/home",
			type: "directory",
			nodes: [
				{
					id: 6,
					name: "/hello",
					type: "file",
					content: "Hello world!"
				},
				{
					id: 7,
					name: "/romera",
					type: "directory",
					nodes: [
						{
							id: 8,
							name: "/desktop",
							type: "directory"
						}
					]
				}
			]
		}
	]
};

describe("get path from filesystem node", () => {
	it("should find a directory", () => {
		expect(
			getPathFromNode(
				{ id: 5, name: "/home", type: "directory" },
				mockFilesystem
			)
		).toBe("/home");

		expect(
			getPathFromNode(
				{
					id: 8,
					name: "/desktop",
					type: "directory"
				},
				mockFilesystem
			)
		).toBe("/home/romera/desktop");

		expect(
			getPathFromNode(
				{
					id: -1,
					name: "/desktop",
					type: "directory"
				},
				mockFilesystem
			)
		).toBeNull();
	});
});
