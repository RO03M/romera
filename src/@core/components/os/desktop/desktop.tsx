import styled from "styled-components";
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
		};
	}, [resetFocus]);

	return (
		<DesktopArea id={"desktop-area"}>
			{items.map((file) => (
				<ApplicationItem
					key={file.inode}
					type={file.type}
					name={file.name}
					icon={file.icon}
					focused={focusedItem === file.inode}
					onFocus={() => {
						setFocusedItem(file.inode);
					}}
				/>
			))}
		</DesktopArea>
	);
}

const DesktopArea = styled.div((props) => ({
	width: "100vw",
	height: "100vh",
	overflow: "hidden",
	backgroundColor: props.theme.colors.purple[600]
}));
