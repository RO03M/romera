import "@xterm/xterm/css/xterm.css";
import { useRef } from "preact/hooks";
import styled, { ThemeProvider } from "styled-components";
import type { ContextMenuRef } from "./@core/components/os/context-menu/context-menu";
import { DesktopContext } from "./@core/components/os/desktop/desktop-context";
import { TopPanel } from "./@core/components/os/top-panel/top-panel";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import "./app.css";
import { theme } from "./theme";
import { Kernel } from "@romos/kernel";
import { useWallpaper } from "./@core/hooks/use-wallpaper";
import { Grid } from "./components/grid/grid";
import { Dock } from "./components/dock/dock";

export const filesystem = Kernel.instance().filesystem;

export function App() {
	const contextRef = useRef<ContextMenuRef | null>(null);

	const wallpaper = useWallpaper();

	return (
		<ThemeProvider theme={theme}>
			<Main
				id={"main"}
				style={{
					backgroundImage: `url("${wallpaper}")`,
				}}
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
