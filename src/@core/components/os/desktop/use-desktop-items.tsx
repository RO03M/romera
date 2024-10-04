import { useMemo } from "preact/hooks";
import { filesystem } from "../../../../app";
import { Stat } from "../../../filesystem/stat";

export function useDesktopItems() {
	const files = useMemo(() => {
		return filesystem
			.readdir("/home/romera/desktop", { withFileTypes: true })
			.filter((stat) => stat instanceof Stat);
	}, []);

	return { files };
}
