import { Desktop } from "./@core/components/os/desktop";
import { Window } from "./@core/components/os/desktop/window/window";
import { TerminalWindow } from "./programs/terminal-window";
import "./app.css";
import { Notepad } from "./programs/notepad";
import { Explorer } from "./programs/explorer/explorer";

export function App() {
	return (
		<div id={"main"}>
			<Desktop />
			<Window content={<Explorer initialPath={"/"} />} />
			<Window content={<Notepad filePath={"/bin/ls"} />} />
			<TerminalWindow />
		</div>
	);
	// return <Terminal/>;
}
