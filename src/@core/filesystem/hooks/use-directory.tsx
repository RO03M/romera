import { useMemo } from "preact/hooks";
import { useFilesystem } from "../use-filesystem";

export function useDir(path?: string) {
	const { findDirectory } = useFilesystem();

	const dir = useMemo(() => {
		if (!path) {
			return null;
		}

		return findDirectory(path);
	}, [path, findDirectory]);

	return {
		dir
	};
}
