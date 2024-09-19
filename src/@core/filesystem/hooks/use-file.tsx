import { useMemo } from "preact/hooks";
import { useFilesystem } from "../use-filesystem";

export function useFile(path?: string) {
	const { findFile } = useFilesystem();

	if (!path) {
		return null;
	}

	return useMemo(() => {
		if (!path) {
			return null;
		}

		return findFile(path);
	}, [path, findFile]);
}
