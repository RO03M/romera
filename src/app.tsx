import { ThemeProvider } from "styled-components";
import { Desktop } from "./@core/components/os/desktop";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { ProcessesHeart } from "./@core/processes/processes-heart";
import "./app.css";
import { theme } from "./theme";

export function App() {
	return (
		<ThemeProvider theme={theme}>
			<div id={"main"}>
				<Desktop />
				<WindowManager />
				<ProcessesHeart />
			</div>
		</ThemeProvider>
	);
}
