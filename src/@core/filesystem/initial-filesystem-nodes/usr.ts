import { incrementalId } from "../../utils/incremental-id";
import type { Node } from "../node";

export const usr: Node = {
	id: incrementalId(),
	name: "/usr",
	type: "directory",
	nodes: [
		{
			id: incrementalId(),
			name: "/applications",
			type: "directory",
			nodes: [
				{
					id: incrementalId(),
					name: "/jsfile.js",
					type: "file",
					content: "[Desktop Entry];\nx=0;\ny=0;\ndefaultExecName=monaco"
				},
				{
					id: incrementalId(),
					name: "/file2",
					type: "file",
					content: "[Desktop Entry];\nx=0;\ny=1;"
				},
				{
					id: incrementalId(),
					name: "/folder",
					type: "file",
					content: "[Desktop Entry];\nx=0;\ny=2;\ndefaultExecName=terminal;"
				}
			]
		}
	]
};
