import { incrementalId } from "../../../utils/incremental-id";
import type { Node } from "../../node";
import { findNodeFromTree } from "../find-node-from-tree";
import { normalize } from "../path";
import { doActionOnNode } from "./do-action-on-node";

export function createNodeOnTree(
	parentPath: string,
	root: Node,
	newNode: Omit<Node, "id">
) {
	const parentNode = findNodeFromTree(parentPath, root);

	if (parentNode === null) {
		return {
			status: false,
			message: "INVALID_PARENT_PATH"
		};
	}

	if (parentNode.type !== "directory") {
		return {
			status: false,
			message: "PARENT_NODE_IS_NOT_A_DIRECTORY"
		};
	}

	const equalNodeExists =
		parentNode.nodes?.find((childNode) => {
			return (
				childNode.type === newNode.type &&
				childNode.name === normalize(newNode.name)
			);
		}) !== undefined;

	if (equalNodeExists) {
		return {
			status: false,
			message: "NODE_ALREAD_EXISTS"
		};
	}

	const [rootWithNode] = doActionOnNode(parentPath, root, (node) => {
		if (node.type !== "directory") {
			return;
		}

		if (!node.nodes) {
			node.nodes = [];
		}

		node.nodes.push({
            id: incrementalId(),
            name: normalize(newNode.name),
            type: newNode.type,
            createdAt: new Date()
        });
	});

    return {
        status: true,
        nodeTree: rootWithNode
    };
}
