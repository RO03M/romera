import type { Node } from "../../node";
import { normalize } from "../path";

export function doActionOnNode(
	path: string,
	root: Node,
	action: (node: Node) => void
) {
	const clonedRoot = structuredClone(root);

	const normalizedPath = normalize(path);
	let splittedPath: string[] = [];
	if (normalizedPath === "/") {
		splittedPath = ["/"];
	} else {
		splittedPath = normalizedPath.split("/").map((nodePath) => `/${nodePath}`);
	}

	let currentNode: Node | undefined = clonedRoot;

	for (let i = 0; i < splittedPath.length; i++) {
		const isLastPath = splittedPath.length - 1 === i;

		if (currentNode === undefined) {
			break;
		}

		if (!isLastPath) {
			if (currentNode.nodes === undefined || currentNode.nodes.length === 0) {
				currentNode = undefined;
                break;
			}

			const nextNodeIndex = currentNode.nodes.findIndex(
				(node) => node.name === splittedPath[i + 1]
			);

			if (nextNodeIndex === -1) {
				currentNode = undefined;
				break;
			}

			currentNode = currentNode.nodes[nextNodeIndex];
		} else {
			action(currentNode);
		}
	}

	return clonedRoot;
}