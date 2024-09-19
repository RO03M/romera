import { useMemo } from "preact/hooks";
import { useFilesystem } from "../use-filesystem";

export function useDir(path?: string) {
	const { findDirectory } = useFilesystem();

	if (!path) {
		return null;
	}

	return useMemo(() => {
		if (!path) {
			return null;
		}

		return findDirectory(path);
	}, [path, findDirectory]);
}
