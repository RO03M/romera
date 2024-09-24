import { Desktop } from "./@core/components/os/desktop";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import "./app.css";

export function App() {
	return (
		<div id={"main"}>
			<Desktop />
			<WindowManager />
		</div>
	);
}
