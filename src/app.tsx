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

export const filesystem = new Filesystem("rome-os-fs");
filesystem.hydrate(initialRoot);

export function App() {
	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<ProcessesHeart />
			<Terminal />
		</div>
	);

	// return (
	// 	<ThemeProvider theme={theme}>
	// 		<div id={"main"}>
	// 			<TopPanel />
	// 			<WindowManager />
	// 			<Desktop />
	// 			<Dock />
	// 		</div>
	// 	</ThemeProvider>
	// );
}
