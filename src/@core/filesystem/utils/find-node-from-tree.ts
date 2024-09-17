import type { Node } from "../node";
import { normalize } from "./path";

export function findNodeFromTree(path: string, root: Node) {
	const normalizedPath = normalize(path);
	let splittedPath: string[] = [];
	if (normalizedPath === "/") {
		splittedPath = ["/"];
	} else {
		splittedPath = normalizedPath.split("/").map((nodePath) => `/${nodePath}`);
	}

	let currentNode: Node | undefined = root;

	for (let i = 0; i < splittedPath.length; i++) {
		if (i + 1 === splittedPath.length) {
			continue;
		}

		if (currentNode === undefined) {
			break;
		}

		const match: Node | undefined = currentNode.nodes?.find(
			(node) => node.name === splittedPath[i + 1]
		);

		currentNode = match;
	}

	if (currentNode === undefined) {
		return null;
	}

	return currentNode;
}
