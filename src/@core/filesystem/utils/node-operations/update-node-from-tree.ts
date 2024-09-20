import type { Node } from "../../node";
import { normalize } from "../path";

export function updateNodeFromTree(
	path: string,
	root: Node,
	content: Node["content"]
) {
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

		const isLastPath = splittedPath.length - 1 === i + 1;

		console.log(isLastPath)

		if (isLastPath && match) {
			console.log("parrararaar");
			for (const foda of currentNode.nodes ?? []) {
				if (foda.name === splittedPath[i + 1]) {
					console.log(foda);
					foda.content = content;
				}
			}
		}

		currentNode = match;
	}

	return root;
	
}
