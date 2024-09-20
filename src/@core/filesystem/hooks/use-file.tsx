import { useCallback, useMemo } from "preact/hooks";
import { useFilesystem } from "../use-filesystem";

export function useFile(path?: string) {
	const { findFile, putFile, pathFromNode } = useFilesystem();

	const file = useMemo(() => {
		if (!path) {
			return null;
		}

		return findFile(path);
	}, [path, findFile]);

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
