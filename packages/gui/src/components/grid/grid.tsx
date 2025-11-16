import { Kernel } from "@romos/kernel";
import { getFilesFromDataTransferItems } from "../../@core/utils/datatransfer-to-files";
import { positionToGridPosition } from "../../@core/utils/grid";
import { DotDesktop } from "../../os/dot-desktop";
import { GridItem } from "../grid-item/grid-item";
import { useItems } from "../grid-item/use-items";
import styles from "./grid.module.css";

export function Grid() {
	const { items } = useItems();

	return (
		<div
			className={styles.grid}
			onDrop={async (event) => {
				const { x, y } = positionToGridPosition([event.clientX, event.clientY]);
				event.preventDefault();
				if (event.dataTransfer === null) {
					return;
				}

				const filedrag = event.dataTransfer.getData("filedrag");

				const dotDesktop = await DotDesktop.load();

				if (typeof filedrag === "string" && filedrag !== "") {
					// console.log(filedrag, x, y, dotDesktop.getAt(x, y), dotDesktop.get(), dotDesktop);
					if (dotDesktop.hasPos(x, y)) {
						return;
					}
					dotDesktop.move(filedrag, x, y);

					// console.time("save");
					await dotDesktop.save();
					// console.timeEnd("save");
				}

				if (filedrag === "") {
					const dotDesktop = await DotDesktop.load();
					const data = await getFilesFromDataTransferItems(event.dataTransfer.items);
					for (const entries of data) {
						const [x, y] = dotDesktop.getEmptyCell(10, 10);

						dotDesktop.add(entries.name, x, y, {});
						Kernel.instance().filesystem.hydrate(entries, "/home/romera/desktop");
					}

					await dotDesktop.save();
				}
			}}
			onDragOver={(event) => event.preventDefault()}
		>
			{items.map((item) => (
				<GridItem
					key={item.inode}
					type={item.type}
					name={item.name}
					filepath={item.filepath}
					program={item.program}
					icon={item.icon}
					x={item.x}
					y={item.y}
				/>
			))}
		</div>
	);
}
