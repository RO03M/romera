import { Window } from "../@core/components/os/desktop/window/window";
import { Terminal } from "../@core/components/os/terminal/terminal";

export function TerminalWindow() {
	return <Window content={<Terminal />} />;
}
