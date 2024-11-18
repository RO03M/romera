import "@xterm/xterm/css/xterm.css";
import { useCallback, useRef } from "preact/hooks";
import styled, { ThemeProvider } from "styled-components";
import type { ContextMenuRef } from "./@core/components/os/context-menu/context-menu";
import { Desktop } from "./@core/components/os/desktop";
import { ApplicationConfig } from "./@core/components/os/desktop/application-item/application-config-file";
import { DesktopContext } from "./@core/components/os/desktop/desktop-context";
import { Dock } from "./@core/components/os/dock/dock";
import { TTYManager } from "./@core/components/os/terminal/tty";
import { TopPanel } from "./@core/components/os/top-panel/top-panel";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { Filesystem } from "./@core/filesystem/filesystem";
import { extname } from "./@core/filesystem/utils/path";
import { ProcessScheduler } from "./@core/processes/process-scheduler";
import { getFilesFromDataTransferItems } from "./@core/utils/datatransfer-to-files";
import { positionToGridPosition } from "./@core/utils/grid";
import { safe } from "./@core/utils/safe";
import "./app.css";
import { theme } from "./theme";

export const filesystem = new Filesystem("rome-os-fs");
filesystem.init();

export const processScheduler = new ProcessScheduler();

export const terminalManager = new TTYManager();

setInterval(() => {
	processScheduler.tick().next();
}, 0);

export function App() {
	const contextRef = useRef<ContextMenuRef | null>(null);

	const onFileDrop = useCallback(async (event: DragEvent) => {
		const { x, y } = positionToGridPosition([event.clientX, event.clientY]);

		event.preventDefault();
		if (event.dataTransfer === null) {
			return;
		}

		const filedrag = event.dataTransfer.getData("filedrag");

		if (filedrag !== "") {
			const { error, data: parsedFiledrag } = safe(() => JSON.parse(filedrag));

			if (error) {
				console.error("Couldn't decode filedrag object", error, filedrag);
				return;
			}

			if (!("name" in parsedFiledrag)) {
				console.error("Name is not present in filedrag object", parsedFiledrag);
				return;
			}

			const applicationConfig = await ApplicationConfig.fromFSApplication(
				parsedFiledrag.name
			);
			applicationConfig.x = x;
			applicationConfig.y = y;
			applicationConfig.fsSync(parsedFiledrag.name);
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
			<Main
				id={"main"}
				onDrop={onFileDrop}
				onDragOver={(event) => event.preventDefault()}
				onContextMenu={(event) => contextRef.current?.show(event)}
				onClick={() => contextRef.current?.close()}
			>
				<TopPanel />
				<Desktop />
				<Dock />
				<DesktopContext ref={contextRef} />
				<WindowManager />
			</Main>
		</ThemeProvider>
	);
}

const Main = styled.main({
	display: "flex",
	flexDirection: "column",
	height: "100vh",
	maxHeight: "100vh",
	overflow: "hidden",
	backgroundSize: "contain",
	backgroundImage: `url("https://images.unsplash.com/photo-1473081556163-2a17de81fc97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D")`,
	position: "fixed"
});
