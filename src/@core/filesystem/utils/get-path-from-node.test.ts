import { describe, expect, it } from "vitest";
import { getPathFromNode } from "./get-path-from-node";
import { mockFilesystem } from "./test-data";

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
