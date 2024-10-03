import type { HydrationData } from "../types";

export const usr: HydrationData = {
	name: "/usr",
	type: "dir",
	nodes: [
		{
			name: "/applications",
			type: "dir",
			nodes: [
				{
					name: "/jsfile.js",
					type: "file",
					content: "[Desktop Entry];\nx=0;\ny=0;\ndefaultExecName=monaco"
				},
				{
					name: "/file2",
					type: "file",
					content: "[Desktop Entry];\nx=0;\ny=1;"
				},
				{
					name: "/folder",
					type: "file",
					content: "[Desktop Entry];\nx=0;\ny=2;\ndefaultExecName=terminal;"
				}
			]
		}
	]
};
