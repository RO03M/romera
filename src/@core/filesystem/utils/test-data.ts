import type { Node } from "../node";

export const mockFilesystem: Node = {
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
