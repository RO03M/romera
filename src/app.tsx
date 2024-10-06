import { ThemeProvider } from "styled-components";
import { Desktop } from "./@core/components/os/desktop";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { ProcessesHeart } from "./@core/processes/processes-heart";
import "./app.css";
import { theme } from "./theme";
import { Dock } from "./@core/components/os/dock/dock";
import { TopPanel } from "./@core/components/os/top-panel/top-panel";
import { Terminal } from "./@core/components/os/terminal/terminal";
import { Filesystem } from "./@core/filesystem/filesystem";
import { initialRoot } from "./@core/filesystem/initial-filesystem-nodes";
import { useCallback } from "preact/hooks";
import { getFilesFromDataTransferItems } from "./@core/utils/datatransfer-to-files";

export const filesystem = new Filesystem("rome-os-fs");
filesystem.hydrate(initialRoot);

export function App() {
	const onFileDrop = useCallback(async (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer === null) {
			return;
		}

		const data = await getFilesFromDataTransferItems(event.dataTransfer.items);
		for (const entries of data) {
			filesystem.hydrate(entries, "/home/romera/desktop");
		}
		console.log(filesystem.root);
		// const files = await getFilesFromDataTransferItems(event.dataTransfer.items);

		// for (const file of files) {
		// 	const buffer = await file
		// 		.arrayBuffer()
		// 		.then((buffer) => new Uint8Array(buffer));

		// 	console.log(file, file.filepath, buffer);
		// }

		// console.log(files);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<div
				id={"main"}
				onDrop={onFileDrop}
				onDragOver={(event) => event.preventDefault()}
			>
				<TopPanel />
				<WindowManager />
				<Desktop />
				<Dock />
			</div>
		</ThemeProvider>
	);
}
