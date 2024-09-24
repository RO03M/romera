import { incrementalId } from "../../utils/incremental-id";
import type { Node } from "../node";

export const mockFilesystem: Node = {
	id: incrementalId(),
	name: "/",
	type: "directory",
	nodes: [
		{
			id: incrementalId(),
			name: "/bin",
			type: "directory",
			nodes: [
				{
					id: incrementalId(),
					type: "file",
					name: "/ls",
					content: "ls file"
				},
				{
					id: incrementalId(),
					type: "file",
					name: "/cat",
					content: "cat file"
				}
			]
		},
		{
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
							type: "directory"
						}
					]
				}
			]
		},
		{
			id: incrementalId(),
			name: "/dev",
			type: "directory",
			nodes: [
				{
					id: incrementalId(),
					name: "/gips",
					type: "directory",
					description:
						"Graphical Interfaces Processes (dir to store the actives windows)",
					nodes: [
						{
							id: incrementalId(),
							name: "/foo",
							type: "gip",
							content: {
								component: () => {}
							}
						}
					]
				}
			]
		},
	]
};
