import { styled } from "@mui/material";
import type { Node } from "../../../@core/filesystem/node";
import { ExplorerListItem } from "./item";

interface ExplorerListProps {
	nodes: Node[];
	onOpen: (node: Node) => void;
}

export function ExplorerList(props: ExplorerListProps) {
	const { nodes, onOpen } = props;

	return (
		<Wrapper>
			{nodes.map((node) => (
				<ExplorerListItem
					key={node.id}
					node={node}
					onClick={onOpen}
				/>
			))}
		</Wrapper>
	);
}

const Wrapper = styled<"div">("div")({
	display: "flex",
	flexDirection: "column"
});
