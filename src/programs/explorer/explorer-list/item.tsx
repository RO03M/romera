import { styled } from "@mui/material";
import type { Dirent } from "../../../@core/filesystem/dirent";

interface ExplorerListItemProps {
	entry: Dirent;
	onClick: (entry: Dirent) => void;
}

export function ExplorerListItem(props: ExplorerListItemProps) {
	const { entry: node, onClick } = props;

	return (
		<Wrapper
			id={`explorer-list-item-node-${node.inode}`}
			onClick={() => onClick(node)}
		>
			<div>{node.name.replace(/^\//, "")}</div>
			<div>{node.type}</div>
			{/* <div>{children}</div> */}
		</Wrapper>
	);
}

const Wrapper = styled<"div">("div")({
	width: "100%",
	height: 30,
	display: "grid",
	gridTemplateColumns: "1fr 1fr 1fr",
	"&:hover": {
		backgroundColor: "#707070"
	},
	"& > *": {
		overflow: "hidden",
		textOverflow: "ellipsis"
	}
});
