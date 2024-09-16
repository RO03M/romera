import type { Node } from "../node";

export function findNodeFromTree(path: string, root: Node) {
	const splittedPath = path
		.split(/(?=[\/])|(?<=[\/])/g)
		.map((nodePath) => `/${nodePath}`.replace("//", "/"));

	let currentNode: Node | undefined = root;

	console.log(path, splittedPath);

	for (let i = 0; i < splittedPath.length; i++) {
		if (i + 1 === splittedPath.length) {
			console.log(i);
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

	console.log(currentNode);

	if (currentNode === undefined) {
		return null;
	}

	return currentNode;
}
