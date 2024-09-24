import type { File, Gip, Node } from "../../node";
import { doActionOnNode } from "./do-action-on-node";

export function updateNodeFromTree(
	path: string,
	root: Node,
	content: File["content"] | Gip["content"]
) {
	const [updatedRoot] = doActionOnNode(path, root, (node) => {
		if (node !== undefined && node.type !== "directory") {
			node.content = content;
		}
	});

	return updatedRoot;
}
