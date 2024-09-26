import { useCallback, useMemo, useState } from "preact/hooks";
import { useDir } from "../../@core/filesystem/hooks/use-directory";
import type { Node } from "../../@core/filesystem/node";
import { normalize } from "../../@core/filesystem/utils/path";
import { ExplorerList } from "./explorer-list/list";
import type { ProcessComponentProps } from "../../@core/processes/types";

export function Explorer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const [path, setPath] = useState(workingDirectory);

	const { dir } = useDir(path);

	const nodes = useMemo(() => {
		const parentNode: Node = {
			id: -1,
			name: "/..",
			type: "directory"
		};

		if (!dir || dir?.nodes === undefined) {
			return [parentNode];
		}

		return [parentNode, ...dir.nodes];
	}, [dir]);

	const goToNode = useCallback(
		(node: Node) => {
			if (node.type !== "directory") {
				return;
			}

			const newPath = normalize(path + node.name);
			setPath(newPath);
		},
		[path]
	);

	return (
		<div>
			<span>{path}</span>
			<ExplorerList nodes={nodes} onOpen={goToNode} />
		</div>
	);
}
