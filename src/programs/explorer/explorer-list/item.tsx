import { styled } from "@mui/material";
import type { Node } from "../../../@core/filesystem/node";

interface ExplorerListItemProps {
    node: Node;
    onClick: (node: Node) => void;
}

export function ExplorerListItem(props: ExplorerListItemProps) {
    const { node, onClick } = props;

	return (
		<Wrapper
            id={`explorer-list-item-node-${node.id}`}
            onClick={() => onClick(node)}
        >
			<div>{node.name.replace(/^\//, "")}</div>
			<div>{node.type}</div>
			<div>{node.nodes?.length ?? 0}</div>
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
