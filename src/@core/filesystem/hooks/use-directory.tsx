import { useCallback, useMemo } from "preact/hooks";
import { useFilesystem } from "../use-filesystem";

export function useDir(path?: string) {
	const { findDirectory, createFile } = useFilesystem();

	const dir = useMemo(() => {
		if (!path) {
			return null;
		}

		return findDirectory(path);
	}, [path, findDirectory]);

	const createFileInDirectory = useCallback((fileName: string) => {
		if (path === undefined) {
			return false;
		}

		createFile(path, fileName);

		return true;
	}, [path, createFile]);

	return {
		dir,
		createFileInDirectory
	};
}
