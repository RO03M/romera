import "@xterm/xterm/css/xterm.css";
import { useCallback, useRef } from "preact/hooks";
import styled, { ThemeProvider } from "styled-components";
import type { ContextMenuRef } from "./@core/components/os/context-menu/context-menu";
import { ApplicationConfig } from "./@core/components/os/desktop/application-item/application-config-file";
import { DesktopContext } from "./@core/components/os/desktop/desktop-context";
import { TopPanel } from "./@core/components/os/top-panel/top-panel";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { getFilesFromDataTransferItems } from "./@core/utils/datatransfer-to-files";
import { positionToGridPosition } from "./@core/utils/grid";
import { safe } from "./@core/utils/safe";
import "./app.css";
import { theme } from "./theme";
import { extname } from "@romos/fs";
import { Kernel } from "@romos/kernel";
import { useWallpaper } from "./@core/hooks/use-wallpaper";
import { Grid } from "./components/grid/grid";
import { Dock } from "./components/dock/dock";

export const filesystem = Kernel.instance().filesystem;

export function App() {
	const contextRef = useRef<ContextMenuRef | null>(null);

	const wallpaper = useWallpaper();

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
				style={{
					backgroundImage: `url("${wallpaper}")`,
				}}
				// onDrop={(event) => event.prop}
				onDragOver={(event) => event.preventDefault()}
				onContextMenu={(event) => contextRef.current?.show(event)}
				onClick={() => contextRef.current?.close()}
			>
				<TopPanel />
				<Grid />
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
	backgroundSize: "cover",
	backgroundPosition: "center",
	backgroundImage: `url("https://images.unsplash.com/photo-1473081556163-2a17de81fc97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D")`,
	position: "fixed"
});
