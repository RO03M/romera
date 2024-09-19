import { useMemo } from "preact/hooks";
import { useFilesystem } from "../use-filesystem";

export function useNode(path?: string) {
	const { findNode } = useFilesystem();

	if (!path) {
		return null;
	}

	return useMemo(() => {
		if (!path) {
			return null;
		}

		return findNode(path);
	}, [path, findNode]);
}
