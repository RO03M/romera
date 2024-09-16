import { useCallback, useMemo } from "preact/hooks";
import { useFilesystemStore } from "./use-filesystem-store";
import { findNodeFromTree } from "./utils/find-node-from-tree";

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

	const findDirectory = useCallback((path: string) => {
		const node = findNode(path);

		console.log(node);

		if (node === null || node.type !== "directory") {
			return null;
		}

		return node;
	}, [findNode]);

	const std = useMemo(
		() => ({
			fs: {
				findNode
			}
		}),
		[findNode]
	);

	const cmd = useCallback(
		(program: string, options: CommandOptions = { args: [] }) => {
			const { args } = options;
			const functionFile = findNode(`/bin/${program}`);

			console.log(functionFile);

			if (!functionFile) {
				return { found: false, output: null };
			}

			// Isso seria o exemplo de um processo
			const invoke = new Function(
				"std",
				"context",
				functionFile.content ?? ""
			);

			const output = invoke(std, {
				args
			});

			return { found: true, output };
		},
		[std, findNode]
	);

	return {
		store,
		cmd,
		findNode,
		findDirectory
	};
}
