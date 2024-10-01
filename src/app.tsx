import { ThemeProvider } from "styled-components";
import { Desktop } from "./@core/components/os/desktop";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { ProcessesHeart } from "./@core/processes/processes-heart";
import "./app.css";
import { theme } from "./theme";
import { Dock } from "./@core/components/os/dock/dock";
import { TopPanel } from "./@core/components/os/top-panel/top-panel";

export function App() {
	return (
		<ThemeProvider theme={theme}>
			<div id={"main"}>
				<TopPanel />
				<WindowManager />
				<Desktop />
				<Dock />
				<ProcessesHeart />
			</div>
		</ThemeProvider>
	);
}
