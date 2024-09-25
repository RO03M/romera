import { useMemo } from "preact/hooks";
import { useDir } from "../../../filesystem/hooks/use-directory";

export function useDesktopItems() {
	const { dir: desktopDir } = useDir("/home/romera/desktop");

	const items = useMemo(() => {
		if (desktopDir !== null && desktopDir.nodes !== undefined) {
			return desktopDir.nodes;
		}

		return [];
	}, [desktopDir]);

	return { items };
}
