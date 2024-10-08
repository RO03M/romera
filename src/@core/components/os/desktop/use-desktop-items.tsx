import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
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
	const [items, setItems] = useState<DesktopItem[]>([]);

	const fetchItems = useCallback(() => {
		const files = filesystem
			.readdir("/home/romera/desktop", { withFileTypes: true })
			.filter((dirent) => typeof dirent !== "string");

		console.log("teste", files);

		const tempItems: DesktopItem[] = [];
		for (const file of files) {
			const config = getConfigFromApplication(file.name);
			tempItems.push({
				...file,
				x: config.x,
				y: config.y,
				icon: getIconFromApplication(file.name)
			});
		}

		setItems(tempItems);
	}, []);

	useEffect(() => {
		fetchItems();
		filesystem.watch("/home/romera/desktop", (event) => {
			if (event !== "change") {
				return;
			}

			fetchItems();
		});
	}, [fetchItems]);

	return { items };
}
