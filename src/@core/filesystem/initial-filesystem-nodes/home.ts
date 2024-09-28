import { incrementalId } from "../../utils/incremental-id";
import type { Node } from "../node";

export const home: Node = {
	id: incrementalId(),
	name: "/home",
	type: "directory",
	nodes: [
		{
			id: incrementalId(),
			name: "/hello",
			type: "file",
			content: "Hello world!"
		},
		{
			id: incrementalId(),
			name: "/romera",
			type: "directory",
			nodes: [
				{
					id: incrementalId(),
					name: "/desktop",
					type: "directory",
					nodes: [
						{
							id: incrementalId(),
							name: "/jsfile.js",
							type: "file",
							content: "const fuck = false;"
						},
						{
							id: incrementalId(),
							name: "/file2",
							type: "file",
							content: "Hello world!"
						},
						{
							id: incrementalId(),
							name: "/folder",
							type: "directory"
						}
					]
				}
			]
		}
	]
};
