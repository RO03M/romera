import { ExplorerListItem } from "./item";
import type { Dirent } from "../../../@core/filesystem/dirent";
import styled from "styled-components";

interface ExplorerListProps {
	entries: Dirent[];
	onOpen: (entry: Dirent) => void;
}

export function ExplorerList(props: ExplorerListProps) {
	const { entries, onOpen } = props;

	return (
		<Wrapper>
			{entries.map((entry) => (
				<ExplorerListItem key={entry.inode} entry={entry} onClick={onOpen} />
			))}
		</Wrapper>
	);
}

const Wrapper = styled<"div">("div")({
	display: "flex",
	flexDirection: "column"
});
