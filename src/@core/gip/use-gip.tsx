import { useCallback, useMemo } from "preact/hooks";
import { useDir } from "../filesystem/hooks/use-directory";

export function useGip() {
	const { dir, createFileInDirectory } = useDir("/dev/gips");

	const graphicalProcesses = useMemo(() => {
		if (dir !== null && dir.nodes !== undefined) {
			return dir.nodes.filter((node) => node.type === "gip");
		}

		return [];
	}, [dir]);

	return {
		graphicalProcesses
	};
}
