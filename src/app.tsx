import { ThemeProvider } from "styled-components";
import { Desktop } from "./@core/components/os/desktop";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { theme } from "./theme";
import { Dock } from "./@core/components/os/dock/dock";
import { TopPanel } from "./@core/components/os/top-panel/top-panel";
import { Filesystem } from "./@core/filesystem/filesystem";
import { initialRoot } from "./@core/filesystem/initial-filesystem-nodes";
import { useCallback } from "preact/hooks";
import { getFilesFromDataTransferItems } from "./@core/utils/datatransfer-to-files";
import { positionToGridPosition } from "./@core/utils/grid";
import { ApplicationConfig } from "./@core/components/os/desktop/application-item/application-config-file";
import { extname } from "./@core/filesystem/utils/path";
import { DesktopContext } from "./@core/components/os/desktop/desktop-context";
import { ProcessScheduler } from "./@core/processes/process-scheduler";
import "./app.css";


export const filesystem = new Filesystem("rome-os-fs");
filesystem.hydrate(initialRoot);

export const processScheduler = new ProcessScheduler();

setInterval(() => {
	processScheduler.tick().next();
}, 0);

export function App() {
	const onFileDrop = useCallback(async (event: DragEvent) => {
		const { x, y } = positionToGridPosition([event.clientX, event.clientY]);

		event.preventDefault();
		if (event.dataTransfer === null) {
			return;
		}

		const data = await getFilesFromDataTransferItems(event.dataTransfer.items);
		for (const entries of data) {
			const config = new ApplicationConfig({
				x: x.toString(),
				y: y.toString()
			});
			config.setDefaultExecNameFromExt(extname(entries.name));
			filesystem.hydrate(entries, "/home/romera/desktop");
			filesystem.writeFile(
				`/usr/applications/${entries.name}`,
				config.stringify()
			);
		}
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
				<DesktopContext/>
			</div>
		</ThemeProvider>
	);
}
