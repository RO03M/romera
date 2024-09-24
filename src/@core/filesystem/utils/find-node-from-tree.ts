import type { Node } from "../node";
import { doActionOnNode } from "./node-operations/do-action-on-node";

export function findNodeFromTree(path: string, root: Node) {
	const [_, node] = doActionOnNode(path, root, (node) => {
		return node;
	});

	return node;
}
