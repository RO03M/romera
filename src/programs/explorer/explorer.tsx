import { useCallback, useMemo, useState } from "preact/hooks";
import { normalize } from "../../@core/filesystem/utils/path";
import { ExplorerList } from "./explorer-list/list";
import type { ProcessComponentProps } from "../../@core/processes/types";
import { filesystem } from "../../app";
import type { Dirent } from "../../@core/filesystem/dirent";

export function Explorer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const [path, setPath] = useState(workingDirectory);

	const children = useMemo(() => {
		if (path === undefined) {
			return [];
		}

		return filesystem.readdir(path, {
			withFileTypes: true
		}) as Dirent[];
	}, [path]);

	const entries = useMemo(() => {
		const parentNode: Dirent = {
			inode: -1,
			name: "/..",
			type: "dir"
		};

		return [parentNode, ...children];
	}, [children]);

	const goToNode = useCallback(
		(entry: Dirent) => {
			if (entry.type !== "dir") {
				return;
			}

			const newPath = normalize(path + entry.name);
			setPath(newPath);
		},
		[path]
	);

	return (
		<div>
			<span>{path}</span>
			<ExplorerList entries={entries} onOpen={goToNode} />
		</div>
	);
}
