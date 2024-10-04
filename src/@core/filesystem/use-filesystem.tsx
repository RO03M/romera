import { useCallback } from "preact/hooks";
import { format } from "./utils/path";
import { filesystem } from "../../app";

interface BashContext {
	path: string;
}

export interface CommandOptions {
	bashContext?: BashContext;
	args: string[];
}

/**
 * @deprecated
 * Use the filesystem global, this will cause multiple rerenders that may slow down the application
 */
export function useFilesystem() {
	const findNode = useCallback(
		(path: string) => {
			return filesystem.stat(path);
		},
		[]
	);

	const createFile = useCallback(
		(path: string, filename: string) => {
			const resolvedPath = format({ root: path, base: filename });
			return filesystem.writeFile(resolvedPath, "");
		},
		[]
	);

	const createDirectory = useCallback((path: string, dirname: string) => {
		const resolvedPath = format({ root: path, base: dirname });
		return filesystem.mkdir(resolvedPath);
	}, []);

	const findDirectory = useCallback(
		(path: string) => {
			const stat = filesystem.stat(path);

			return stat;
		},
		[]
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
			filesystem.writeFile(path, value);
		},
		[]
	);

	return {
		findNode,
		findDirectory,
		findFile,
		putFile,
		createFile,
		createDirectory
	};
}
