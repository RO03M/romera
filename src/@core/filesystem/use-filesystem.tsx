import { useCallback, useMemo } from "preact/hooks";
import { normalize } from "./utils/path";
import type { Node } from "./node";
import { Filesystem } from "./filesystem";

interface BashContext {
	path: string;
}

export interface CommandOptions {
	bashContext?: BashContext;
	args: string[];
}

export function useFilesystem() {
	const filesystem = useMemo(() => {
		return Filesystem.singleton();
	}, []);

	const findNode = useCallback(
		(path: string) => {
			return filesystem.findNode(path);
		},
		[filesystem]
	);

	const createNode = useCallback(
		(parentPath: string, node: Omit<Node, "id">) => {
			return filesystem.createNode(parentPath, node.name, node.type);
		},
		[filesystem]
	);

	const createFile = useCallback(
		(path: string, fileName: string) => {
			return createNode(path, {
				name: fileName,
				type: "file"
			});
		},
		[createNode]
	);

	const createDirectory = useCallback((path: string, dirName: string) => {
		return createNode(path, {
			name: dirName,
			type: "directory",
			nodes: []
		});
	}, [createNode]);

	const pathFromNode = useCallback(
		(node: Node) => {
			return filesystem.pathFromNodeId(node.id);
		},
		[filesystem]
	);

	const findDirectory = useCallback(
		(path: string) => {
			const node = findNode(path);

			if (node === null || node.type !== "directory") {
				return null;
			}

			return node;
		},
		[findNode]
	);

	const findFile = useCallback(
		(path: string) => {
			const node = findNode(path);

			if (node === null || node.type !== "file") {
				return null;
			}

			return node;
		},
		[findNode]
	);

	const putFile = useCallback(
		(path: string, value: string) => {
			filesystem.updateNode(path, value);
		},
		[filesystem]
	);

	const fsMethods = useMemo(
		() => ({
			findNode,
			createNode,
			path: {
				normalize
			}
		}),
		[findNode, createNode]
	);

	return {
		filesystem,
		fsMethods,
		findNode,
		pathFromNode,
		findDirectory,
		findFile,
		putFile,
		createNode,
		createFile,
		createDirectory
	};
}
