import { useCallback, useRef, useState } from "preact/hooks";
import styled from "styled-components";
import {
	ContextMenu,
	type ContextMenuRef
} from "../../@core/components/os/context-menu/context-menu";
import type { Dirent } from "../../@core/filesystem/dirent";
import { normalize } from "../../@core/filesystem/utils/path";
import { useClickOutside } from "../../@core/hooks/use-click-outside";
import type { ProcessComponentProps } from "../../@core/processes/types";
import { safe } from "../../@core/utils/safe";
import { filesystem } from "../../app";
import { ExplorerList } from "./explorer-list/list";
import { useEntries } from "./use-entries";

export function Explorer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const [path, setPath] = useState(workingDirectory);
	const contextRef = useRef<ContextMenuRef | null>(null);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const entries = useEntries(path);

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

	const newDirectory = useCallback(() => {
		const dirname = prompt("Directory name");
		const response = safe(() =>
			filesystem.mkdir(normalize(`${path}/${dirname}`))
		);

		if (response.error !== null) {
			alert("Já existe");
		}
	}, [path]);

	useClickOutside(wrapperRef, () => contextRef.current?.close());

	return (
		<Wrapper
			ref={wrapperRef}
			onClick={() => contextRef.current?.close()}
			onContextMenu={(event) => {
				event.stopPropagation();
				contextRef.current?.show(event);
			}}
		>
			<span>{path}</span>
			<ExplorerList entries={entries} onOpen={goToNode} />
			<ContextMenu ref={contextRef}>
				<li>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<span onClick={() => newDirectory()}>New Folder</span>
				</li>
			</ContextMenu>
		</Wrapper>
	);
}

const Wrapper = styled.div({
	height: "100%"
});
