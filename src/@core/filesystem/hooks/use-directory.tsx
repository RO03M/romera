import { useCallback, useMemo } from "preact/hooks";
import { useFilesystem } from "../use-filesystem";

export function useDir(path?: string) {
	const { findDirectory, pathFromNode, createFile } = useFilesystem();

	const dir = useMemo(() => {
		if (!path) {
			return null;
		}

		return findDirectory(path);
	}, [path, findDirectory]);

	const dirPath = useMemo(() => {
		if (dir === null) {
			return null;
		}

		return pathFromNode(dir);
	}, [dir, pathFromNode]);

	const createFileInDirectory = useCallback((fileName: string) => {
		if (dirPath === null) {
			return false;
		}

		createFile(dirPath, fileName);

		return true;
	}, [dirPath, createFile]);

	return {
		dir,
		createFileInDirectory
	};
}
