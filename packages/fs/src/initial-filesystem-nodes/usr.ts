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
					name: "/Sobre mim",
					type: "file",
					content: "[Desktop Entry];\nx=0;\ny=0;\ndefaultExecName=monaco"
				},
				{
					name: "/Projetos",
					type: "file",
					content: "[Desktop Entry];\nx=0;\ny=1;"
				}
			]
		}
	]
};
