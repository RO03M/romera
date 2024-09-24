import { styled } from "@mui/material";
import { ApplicationItem } from "./application-item";
import { useDesktopItems } from "./use-desktop-items";

export function Desktop() {

	const { items } = useDesktopItems();

	return (
		<Wrapper id={"desktop-area"}>
			{items.map((desktopItem) => (
				<ApplicationItem
					key={desktopItem.id}
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
