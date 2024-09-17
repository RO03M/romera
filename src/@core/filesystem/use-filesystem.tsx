import { useCallback, useMemo } from "preact/hooks";
import { useFilesystemStore } from "./use-filesystem-store";
import { findNodeFromTree } from "./utils/find-node-from-tree";
import { normalize } from "./utils/path";

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

		if (node === null || node.type !== "directory") {
			return null;
		}

		return node;
	}, [findNode]);

	const std = useMemo(
		() => ({
			fs: {
				findNode,
				path: {
					normalize
				}
			}
		}),
		[findNode]
	);

	const cmd = useCallback(
		(program: string, options: CommandOptions = { args: [] }) => {
			const { args, bashContext } = options;
			const functionFile = findNode(`/bin/${program}`);

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
		findDirectory
	};
}
