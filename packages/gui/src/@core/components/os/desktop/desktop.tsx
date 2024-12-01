import styled from "styled-components";
import { ApplicationItem } from "./application-item";
import { useDesktopItems } from "./use-desktop-items";
import { desktop } from "../../../../constants";
// import { safe } from "@romos/utils";
import { Filesystem } from "@romos/fs";

// const asd = safe(() => console.log(10));
const filesystm = new Filesystem("asd");

console.log(filesystm);

export function Desktop() {
	const { items } = useDesktopItems();

	return (
		<DesktopArea id={"desktop-area"}>
			{items.map((file) => (
				<ApplicationItem
					key={file.inode}
					type={file.type}
					name={file.name}
					icon={file.icon}
				/>
			))}
		</DesktopArea>
	);
}

const DesktopArea = styled.div(() => ({
	display: "grid",
	gridTemplateColumns: `repeat(auto-fill, ${desktop.grid.width}px)`,
	gridTemplateRows: `repeat(auto-fill, ${desktop.grid.height}px)`,
	width: "100vw",
	flex: 1,
	overflow: "hidden"
}));
