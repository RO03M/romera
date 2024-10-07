import { ThemeProvider } from "styled-components";
import { Desktop } from "./@core/components/os/desktop";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { ProcessesHeart } from "./@core/processes/processes-heart";
import "./app.css";
import { theme } from "./theme";
import { Dock } from "./@core/components/os/dock/dock";
import { TopPanel } from "./@core/components/os/top-panel/top-panel";
import { Filesystem } from "./@core/filesystem/filesystem";
import { initialRoot } from "./@core/filesystem/initial-filesystem-nodes";
import { useCallback } from "preact/hooks";
import { getFilesFromDataTransferItems } from "./@core/utils/datatransfer-to-files";
import { positionToGridPosition } from "./@core/utils/grid";
import { ApplicationConfig } from "./@core/components/os/desktop/application-item/application-config-file";

export const filesystem = new Filesystem("rome-os-fs");
filesystem.hydrate(initialRoot);

export function App() {
	const onFileDrop = useCallback(async (event: DragEvent) => {
		const { x, y } = positionToGridPosition([event.clientX, event.clientY]);

		const config = new ApplicationConfig({ x: x.toString(), y: y.toString() });
		event.preventDefault();
		if (event.dataTransfer === null) {
			return;
		}

		const data = await getFilesFromDataTransferItems(event.dataTransfer.items);
		for (const entries of data) {
			filesystem.hydrate(entries, "/home/romera/desktop");
			filesystem.writeFile(`/usr/applications/${entries.name}`, config.stringify());
		}
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<div
				id={"main"}
				onDrop={onFileDrop}
				onDragOver={(event) => event.preventDefault()}
			>
				<ProcessesHeart />
				<TopPanel />
				<WindowManager />
				<Desktop />
				<Dock />
			</div>
		</ThemeProvider>
	);
}
