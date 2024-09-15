import { styled } from "@mui/material";
import { useDesktopItems } from "../../../stores/desktop";
import { ApplicationItem } from "./application-item";

export function Desktop() {

	const { items } = useDesktopItems();

	return (
		<Wrapper id={"desktop-area"}>
			{items.map((desktopItem) => (
				<ApplicationItem
					key={desktopItem.id}
					id={desktopItem.id}
					gridPosition={desktopItem.gridPosition}
					name={desktopItem.name}
				/>
			))}
		</Wrapper>
	);
}

const Wrapper = styled<"div">("div")({
	width: "100vw",
	height: "100vh",
	overflow: "hidden"
});
