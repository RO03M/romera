import { useCallback, useEffect, useState } from "preact/hooks";
import { type DotDesktoObject, DotDesktop } from "../../os/dot-desktop";
import { Kernel } from "@romos/kernel";
import { basename, type Stat } from "@romos/fs";
import { BlobManager } from "../../blob-manager";
import { System } from "../../os/system";

interface GridItem extends DotDesktoObject {
	inode: number;
	type: Stat["type"];
	program: string;
	filepath: string;
}

export function useItems() {
	const [items, setItems] = useState<GridItem[]>([]);

	const mountItems = useCallback(async () => {
		const entries = Kernel.instance().filesystem.readdir(
			"/home/romera/desktop",
			{ withFileTypes: true }
		);

		const dotDesktop = await DotDesktop.load();
		const system = await System.load();

		const gridItems: GridItem[] = [];
		
		for (const entry of entries) {
			const entryName = basename(entry.name);
			if (!dotDesktop.hasName(entryName)) {
				const [x, y] = dotDesktop.getEmptyCell(10, 10);

				dotDesktop.add(entryName, x, y, {});
			}

			const defaultIconPath = system.getDefaultIcon(entry.name, entry.type);
			const customIconPath = dotDesktop.getByName(entryName)?.icon;
			const iconPath = customIconPath ? customIconPath : defaultIconPath;
			const iconBlob = await BlobManager.instance().get(iconPath);
			const filepath = `/home/romera/desktop/${entry.name}`;

			const stat = Kernel.instance().filesystem.lstat(filepath);
			const lpath = stat?.target ?? entry.name;
			const program = system.getDefaultProgram(lpath, entry.type);

			gridItems.push({
				...dotDesktop.getByName(entryName)!,
				filepath: filepath,
				program: program,
				icon: iconBlob ?? "",
				inode: entry.inode,
				type: entry.type
			});
		}

		setItems([...gridItems]);
	}, []);

	useEffect(() => {
		mountItems().catch();
		Kernel.instance().filesystem.watch("/home/romera/desktop", (event) => {
			if (event !== "change") {
				return;
			}

			mountItems().catch();
		});

		Kernel.instance().filesystem.watch("/home/romera/.desktop", (event) => {
			if (event !== "change") {
				return;
			}

			mountItems().catch();
		});
	}, [mountItems]);

	return {
		items
	};
}
