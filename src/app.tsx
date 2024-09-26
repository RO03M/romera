import { Desktop } from "./@core/components/os/desktop";
import { WindowManager } from "./@core/components/os/window-manager/window-manager";
import { ProcessesHeart } from "./@core/processes/processes-heart";
import "./app.css";

export function App() {
	return (
		<div id={"main"}>
			<Desktop />
			<WindowManager />
			<ProcessesHeart />
		</div>
	);
}
