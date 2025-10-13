import { extname, type Dirent } from "@romos/fs";
import { useCallback, useEffect, useState } from "preact/hooks";
import { filesystem } from "../../../../app";
import { safe } from "../../../utils/safe";
import { getConfigFromApplication } from "./application-item/application-config-file";
import { getIconFromApplication } from "./application-item/get-icon-from-application";
import { useSystem } from "../../../hooks/use-system";
import { blobFromFile } from "../../../utils/file";

interface DesktopItem extends Dirent {
	x: number;
	y: number;
	icon: string;
}

export function useDesktopItems() {
	const [items, setItems] = useState<DesktopItem[]>([]);

	const { iconMap } = useSystem();

	const fetchItems = useCallback(async () => {
		const files = await safe(() =>
			filesystem
				.readdir("/home/romera/desktop", { withFileTypes: true })
				.filter((dirent) => typeof dirent !== "string")
		);

		if (files.error) {
			return;
		}

		const tempItems: DesktopItem[] = [];
		for (const file of files.data) {
			const config = await getConfigFromApplication(file.name);
			const extension = extname(file.name) ?? "";

			const blob = await blobFromFile(iconMap.get(extension) ?? "")
			const iconPath = blob ?? getIconFromApplication(file.name);
			tempItems.push({
				...file,
				x: +config.x,
				y: +config.y,
				icon: iconPath
			});
		}

		setItems(tempItems);
	}, [iconMap]);

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
