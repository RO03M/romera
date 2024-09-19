import type { Node } from "../node";
import { normalize } from "./path";

export function getPathFromNode(node: Node, root: Node, inheritPath = "/"): string | null {
	if (node.id === root.id) {
		return normalize(inheritPath);
	}

	if (root.nodes === undefined) {
		return null;
	}

	let result: string | null = null;

	for (const child of root.nodes) {
		result = getPathFromNode(node, child, inheritPath + child.name);
		if (result !== null) {
			break;
		}
	}

	return result;
}
