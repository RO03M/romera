import styled from "styled-components";
import { ApplicationItem } from "./application-item";
import { useDesktopItems } from "./use-desktop-items";

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

const DesktopArea = styled.div((props) => ({
	width: "100vw",
	height: "100vh",
	overflow: "hidden",
	backgroundColor: props.theme.colors.indigo[900],
	backgroundImage: `url("https://images.unsplash.com/photo-1473081556163-2a17de81fc97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D")`,
	backgroundSize: "contain"
}));
