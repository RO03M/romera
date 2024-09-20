import { Desktop } from "./@core/components/os/desktop";
import { Window } from "./@core/components/os/desktop/window/window";
import { TerminalWindow } from "./programs/terminal-window";
import "./app.css";
import { Notepad } from "./programs/notepad";
import { Explorer } from "./programs/explorer/explorer";
import { CodeEditor } from "./programs/code-editor";
import { Terminal } from "./@core/components/os/terminal/terminal";

export function App() {
	return (
		<div id={"main"}>
			<Desktop />
			<Window content={<CodeEditor filePath={"/home/romera/desktop/hello"} />} />
			<Window content={<Terminal />} />
			{/* <Window content={<Notepad filePath={"/bin/ls"} />} />
			<TerminalWindow /> */}
		</div>
	);
	// return <Terminal/>;
}
