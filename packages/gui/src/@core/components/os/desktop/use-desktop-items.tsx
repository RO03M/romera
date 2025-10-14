import { extname, filename, type Dirent } from "@romos/fs";
import { useCallback, useEffect, useState } from "preact/hooks";
import { filesystem } from "../../../../app";
import { safe } from "../../../utils/safe";
import { getIconFromApplication } from "./application-item/get-icon-from-application";
import { useSystem } from "../../../hooks/use-system";
import { getDotDesktop } from "./dot-desktop";
import { BlobManager } from "../../../../blob-manager";

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

		const rgrid = new Map(
			Object.entries(dotDesktop.grid).map(([key, value]) => [value, key])
		);


		const tempItems: DesktopItem[] = [];
		for (const file of files.data) {
			const extension = extname(file.name) ?? "";

			const blob = await BlobManager.instance().get(
				iconMap.get(extension) ?? ""
			);

			const iconPath = blob ?? getIconFromApplication(file.name);
			const coordsString = rgrid.get(filename(file.name)) ?? "0,0";

			const [x = "0", y = "0"] = coordsString.split(",");

			tempItems.push({
				...file,
				x: +x,
				y: +y,
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
