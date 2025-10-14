import { extname, filename, type Dirent } from "@romos/fs";
import { useCallback, useEffect, useState } from "preact/hooks";
import { filesystem } from "../../../../app";
import { safe } from "../../../utils/safe";
import { getConfigFromApplication } from "./application-item/application-config-file";
import { getIconFromApplication } from "./application-item/get-icon-from-application";
import { useSystem } from "../../../hooks/use-system";
import { blobFromFile } from "../../../utils/file";
import { getDotDesktop } from "./dot-desktop";

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

		const dotDesktop = await getDotDesktop();

		const rgrid = new Map(Object.entries(dotDesktop.grid).map(([key, value]) => [value, key]));
		// const rgrid = grid.values()
		// console.log(rgrid);

		const tempItems: DesktopItem[] = [];
		for (const file of files.data) {
			const config = await getConfigFromApplication(file.name);
			const extension = extname(file.name) ?? "";

			const blob = await blobFromFile(iconMap.get(extension) ?? "")
			const iconPath = blob ?? getIconFromApplication(file.name);
			// console.log(config, file.name);
			const coordsString = rgrid.get(filename(file.name)) ?? "0,0";

			const [x = "0", y = "0"] = coordsString.split(",");
		
			tempItems.push({
				...file,
				x: +x,
				y: +y,
				icon: iconPath
			});
		}

		console.log(tempItems);

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
