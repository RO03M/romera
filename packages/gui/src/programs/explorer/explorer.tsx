import { useCallback, useRef, useState } from "preact/hooks";
import styled from "styled-components";
import {
	ContextMenu,
	type ContextMenuRef
} from "../../@core/components/os/context-menu/context-menu";
import type { Dirent } from "@romos/fs";
import { normalize } from "@romos/fs";
import { useClickOutside } from "../../@core/hooks/use-click-outside";
import type { ProcessComponentProps } from "../../@core/processes/types";
import { safe } from "../../@core/utils/safe";
import { filesystem } from "../../app";
import { addFilesFromDragToDir } from "./drag-to-dir";
import { ExplorerList } from "./explorer-list/list";
import { useEntries } from "./use-entries";
import { Kernel } from "@romos/kernel";

export function Explorer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const [path, setPath] = useState(workingDirectory);
	const contextRef = useRef<ContextMenuRef | null>(null);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const entries = useEntries(path);

	const goToNode = useCallback(
		(entry: Dirent) => {
			const entryPath = normalize(path + entry.name);

			if (entry.type === "file") {
				Kernel.instance().scheduler.exec("component", ["monaco", "monaco", entryPath], { tty: -1, cwd: entryPath });
			}

			if (entry.type !== "dir") {
				return;
			}

			setPath(entryPath);
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
			onDrop={(event) => {
				if (path === undefined) {
					return;
				}
				addFilesFromDragToDir(event, path);
			}}
			onDragOver={(event) => event.preventDefault()}
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
	height: "100%",
	overflowY: "scroll"
});
