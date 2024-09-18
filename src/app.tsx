import { Desktop } from "./@core/components/os/desktop";
import { Window } from "./@core/components/os/desktop/window/window";
import { Terminal } from "./@core/components/os/terminal/terminal";
import "./app.css";

export function App() {
	return (
		<div id={"main"}>
			<Desktop />
			<Window />
		</div>
	);
	// return <Terminal/>;
}
