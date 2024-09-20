import { Desktop } from "./@core/components/os/desktop";
import { Window } from "./@core/components/os/desktop/window/window";
import { Terminal } from "./@core/components/os/terminal/terminal";
import "./app.css";
import { CodeEditor } from "./programs/code-editor";

export function App() {
	return (
		<div id={"main"}>
			<Desktop />
			<Window
				content={<CodeEditor filePath={"/home/romera/desktop/hello"} />}
			/>
			<Window content={<Terminal />} />
			{/* <Window content={<Notepad filePath={"/bin/ls"} />} />
			<TerminalWindow /> */}
		</div>
	);
	// return <Terminal/>;
}
