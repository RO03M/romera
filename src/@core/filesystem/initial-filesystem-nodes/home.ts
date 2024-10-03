import type { HydrationData } from "../types";

export const home: HydrationData = {
	name: "/home",
	type: "dir",
	nodes: [
		{
			name: "/hello",
			type: "file",
			content: "Hello world!"
		},
		{
			name: "/romera",
			type: "dir",
			nodes: [
				{
					name: "/desktop",
					type: "dir",
					nodes: [
						{
							name: "/jsfile.js",
							type: "file",
							content: "const fuck = false;"
						},
						{
							name: "/file2",
							type: "file",
							content: "Hello world!"
						},
						{
							name: "/folder",
							type: "dir"
						}
					]
				}
			]
		}
	]
};
