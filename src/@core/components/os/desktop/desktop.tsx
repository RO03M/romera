import { styled } from "@mui/material";
import { ApplicationItem } from "./application-item";
import { useDesktopItems } from "./use-desktop-items";
import { useCallback, useEffect, useState } from "preact/hooks";

export function Desktop() {
	const { items } = useDesktopItems();
	const [focusedItem, setFocusedItem] = useState<number | null>(null);

	const resetFocus = useCallback(() => {
		setFocusedItem(null);
	}, []);

	useEffect(() => {
		document.addEventListener("click", resetFocus);

		return () => {
			document.removeEventListener("click", resetFocus);
		}
	}, [resetFocus]);

	return (
		<Wrapper id={"desktop-area"}>
			{items.map((desktopItem) => (
				<ApplicationItem
					key={desktopItem.id}
					type={desktopItem.type}
					name={desktopItem.name}
					onFocus={() => {
						setFocusedItem(desktopItem.id)
					}}
					focused={focusedItem === desktopItem.id}
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
