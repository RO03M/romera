import type { Node } from "../node";
import { doActionOnNode } from "./node-operations/do-action-on-node";

export function findNodeFromTree(path: string, root: Node) {
	let result: Node | undefined;

	doActionOnNode(path, root, (node) => {
		result = node;
	});

	return result;
}
