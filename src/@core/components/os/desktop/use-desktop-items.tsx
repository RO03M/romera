import { useMemo } from "preact/hooks";
import { filesystem } from "../../../../app";
import type { Dirent } from "../../../filesystem/dirent";
import { getConfigFromApplication } from "./application-item/application-config-file";
import { getIconFromApplication } from "./application-item/get-icon-from-application";

interface DesktopItem extends Dirent {
	x: number;
	y: number;
	icon: string;
}

export function useDesktopItems() {
	const items = useMemo(() => {
		const files = filesystem
			.readdir("/home/romera/desktop", { withFileTypes: true })
			.filter((dirent) => typeof dirent !== "string");

		const items: DesktopItem[] = [];
		for (const file of files) {
			const config = getConfigFromApplication(file.name);
			items.push({
				...file,
				x: config.x,
				y: config.y,
				icon: getIconFromApplication(file.name)
			});
		}

		return items;
	}, []);

	return { items };
}
