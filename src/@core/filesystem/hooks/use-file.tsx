import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useFilesystem } from "../use-filesystem";

interface UseFileOptions {
	forceCreation?: boolean;
}

export function useFile(path?: string, options?: UseFileOptions) {
	const { findFile, putFile, createFile, pathFromNode } = useFilesystem();

	const file = useMemo(() => {
		if (!path) {
			return null;
		}

		return findFile(path);
	}, [path, findFile]);

	useEffect(() => {
		if (options?.forceCreation && path !== undefined && file === null) {
			const splittedPath = path.split("/");
			const fileName = splittedPath.pop();
			const parentPath = splittedPath.join("/");

			if (fileName !== undefined && parentPath !== undefined) {
				createFile(parentPath, fileName);
			}
		}
	}, [path, file, options?.forceCreation, createFile]);

	const writeFile = useCallback(
		(value = "") => {
			if (file === null) {
				return;
			}

			const path = pathFromNode(file);

			if (!path) {
				return;
			}

			putFile(path, value);
		},
		[file, pathFromNode, putFile]
	);

	return {
		file,
		writeFile
	};
}
