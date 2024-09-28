import { ThemeProvider } from "styled-components";
import { Desktop } from "./@core/components/os/desktop";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { ProcessesHeart } from "./@core/processes/processes-heart";
import "./app.css";
import { theme } from "./theme";
import { Dock } from "./@core/components/os/dock/dock";
import { TopPanel } from "./@core/components/os/top-panel/top-panel";
import { Window } from "./@core/components/os/desktop/window/window";
import { Terminal } from "./@core/components/os/terminal/terminal";

export function App() {
	return (
		<ThemeProvider theme={theme}>
			<Window pid={1} Content={Terminal} />
			<div id={"main"}>
				<TopPanel />
				<Desktop />
				<Dock />
				<WindowManager />
				<ProcessesHeart />
			</div>
		</ThemeProvider>
	);
}
