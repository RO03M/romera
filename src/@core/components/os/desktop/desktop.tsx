import styled from "styled-components";
import { ApplicationItem } from "./application-item";
import { useDesktopItems } from "./use-desktop-items";
import { useCallback, useEffect, useState } from "preact/hooks";
import { getFilesFromDataTransferItems } from "datatransfer-files-promise";

export function Desktop() {
	const { files } = useDesktopItems();
	const [focusedItem, setFocusedItem] = useState<number | null>(null);

	const resetFocus = useCallback(() => {
		setFocusedItem(null);
	}, []);

	const onFileDrop = useCallback(async (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer === null) {
			return;
		}

		const files = await getFilesFromDataTransferItems(
			event.dataTransfer.items
		);

		console.log(files);
	}, []);

	useEffect(() => {
		document.addEventListener("click", resetFocus);

		return () => {
			document.removeEventListener("click", resetFocus);
		};
	}, [resetFocus]);

	return (
		<Wrapper
			id={"desktop-area"}
			onDrop={onFileDrop}
			onDragOver={(event) => event.preventDefault()}
		>
			{files.map((file) => (
				<ApplicationItem
					key={file.inode}
					type={file.type}
					name={"file"}
					onFocus={() => {
						setFocusedItem(file.inode);
					}}
					focused={focusedItem === file.inode}
				/>
			))}
		</Wrapper>
	);
}

const Wrapper = styled.div((props) => ({
	width: "100vw",
	height: "100vh",
	overflow: "hidden",
	backgroundColor: props.theme.colors.purple[600]
}));
