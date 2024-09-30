import { incrementalId } from "../utils/incremental-id";
import { initialRoot } from "./initial-filesystem-nodes/index";
import type { Node } from "./node";
import type { CreateNodeOptions } from "./types";
import { normalize, splitParentPathAndNodeName } from "./utils/path";

export class Filesystem {
	private static instance: Filesystem | null = null;

	public root: Node = initialRoot;

	public static singleton(): Filesystem {
		if (Filesystem.instance === null) {
			Filesystem.instance = new Filesystem();
		}

		return Filesystem.instance;
	}

	private doActionOnNode<T = unknown>(
		path: string,
		action: (node: Node) => T
	): T | null {
		const normalizedPath = normalize(path);
		let splittedPath: string[] = [];
		if (normalizedPath === "/") {
			splittedPath = ["/"];
		} else {
			splittedPath = normalizedPath
				.split("/")
				.map((nodePath) => `/${nodePath}`);
		}

		let currentNode: Node | undefined = this.root;
		let actionResult: T | null = null;

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
				actionResult = action(currentNode);
				break;
			}
		}

		return actionResult;
	}

	public findNode(path: string): Node | null {
		const node = this.doActionOnNode(normalize(path), (node) => node);

		return node;
	}

	public createNode(
		path: string,
		nodeName: string,
		nodeType: Node["type"],
		options: CreateNodeOptions = {}
	) {
		const { makeParents = false } = options;
		const [parentPathFromNodeName, fileName] =
			splitParentPathAndNodeName(nodeName);
		const absoluteParentPath = normalize(`${path}/${parentPathFromNodeName}`);
		const absolutePath = normalize(`${absoluteParentPath}/${fileName}`);
		let parentNode = this.findNode(absoluteParentPath);

		if (parentNode === null && makeParents) {
			const splittedPath = absoluteParentPath
				.split("/")
				.filter((path) => path !== "");
			let previousPath = "/";

			for (let i = 0; i < splittedPath.length; i++) {
				this.createNode(previousPath, splittedPath[i], "directory");
				previousPath += normalize(splittedPath[i]);
			}

			parentNode = this.findNode(absoluteParentPath);
		}

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

		const pathAlreadyExists = Boolean(this.findNode(absolutePath));

		if (pathAlreadyExists) {
			return {
				status: false,
				message: "NODE_ALREADY_EXISTS"
			};
		}

		const newNode = this.doActionOnNode(absoluteParentPath, (node) => {
			if (!node) {
				return null;
			}

			if (!node.nodes) {
				node.nodes = [];
			}

			const newNode: Node = {
				id: incrementalId(),
				name: normalize(fileName),
				type: nodeType
			};

			node.nodes?.push(newNode);

			return newNode;
		});

		return {
			status: true,
			node: newNode
		};
	}

	public updateNode(path: string, content: Node["content"]) {
		return this.doActionOnNode(path, (node) => {
			node.content = content;
			return node;
		});
	}

	public deleteNode(path: string) {
		const [parentPath, nodeName] = splitParentPathAndNodeName(path);
		this.doActionOnNode(parentPath, (node) => {
			node.nodes = node.nodes?.filter((node) => node.name !== nodeName);
		});
	}

	public pathFromNodeId(
		nid: Node["id"],
		root: Node = this.root,
		inheritPath = "/"
	): string | null {
		if (nid === root.id) {
			return normalize(inheritPath);
		}

		if (root.nodes === undefined) {
			return null;
		}

		let result: string | null = null;

		for (const child of root.nodes) {
			result = this.pathFromNodeId(nid, child, inheritPath + child.name);
			if (result !== null) {
				break;
			}
		}

		return result;
	}
}
