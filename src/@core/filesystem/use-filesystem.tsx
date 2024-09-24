import { useCallback, useMemo } from "preact/hooks";
import { useFilesystemStore } from "./use-filesystem-store";
import { findNodeFromTree } from "./utils/find-node-from-tree";
import { normalize } from "./utils/path";
import { getPathFromNode } from "./utils/get-path-from-node";
import type { Node } from "./node";
import { updateNodeFromTree } from "./utils/node-operations/update-node-from-tree";
import { createNodeOnTree } from "./utils/node-operations/create-node-on-tree";

interface BashContext {
	path: string;
}

export interface CommandOptions {
	bashContext?: BashContext;
	args: string[];
}

export function useFilesystem() {
	const store = useFilesystemStore();

	const findNode = useCallback(
		(path: string) => {
			return findNodeFromTree(path, store.node);
		},
		[store.node]
	);

	const createNode = useCallback(
		(parentPath: string, node: Node) => {
			const response = createNodeOnTree(parentPath, store.node, node);

			if (response.status === true && response.nodeTree !== undefined) {
				store.setNode(response.nodeTree);
			}

			return response;
		},
		[store.node, store.setNode]
	);

	const pathFromNode = useCallback(
		(node: Node) => {
			return getPathFromNode(node, store.node);
		},
		[store.node]
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
			store.setNode(updateNodeFromTree(path, store.node, value));
		},
		[store.node, store.setNode]
	);

	const std = useMemo(
		() => ({
			fs: {
				findNode,
				createNode,
				path: {
					normalize
				}
			}
		}),
		[findNode, createNode]
	);

	const cmd = useCallback(
		(program: string, options: CommandOptions = { args: [] }) => {
			const { args, bashContext } = options;
			const functionFile = findNode(`/bin/${program}`);

			if (!functionFile) {
				return { found: false, output: null };
			}

			// Isso seria o exemplo de um processo
			const invoke = new Function("std", "context", functionFile.content ?? "");

			const output = invoke(std, {
				args,
				bashContext
			});

			return { found: true, output };
		},
		[std, findNode]
	);

	return {
		store,
		cmd,
		findNode,
		pathFromNode,
		findDirectory,
		findFile,
		putFile
	};
}
