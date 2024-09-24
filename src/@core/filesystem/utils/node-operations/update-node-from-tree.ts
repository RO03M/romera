import type { Node } from "../../node";
import { doActionOnNode } from "./do-action-on-node";

export function updateNodeFromTree(
	path: string,
	root: Node,
	content: Node["content"]
) {
	const [updatedRoot] = doActionOnNode(path, root, (node) => {
		if (node !== undefined && node.type === "file") {
			node.content = content;
		}
	});

	return updatedRoot;
}
