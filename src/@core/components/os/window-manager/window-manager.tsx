import { useGip } from "../../../gip/use-gip";
import { Window } from "../desktop/window/window";
import { Terminal } from "../terminal/terminal";

export function WindowManager() {
	const { graphicalProcesses } = useGip();

	return (
		<div id={"window-manager"}>
			<Window content={<Terminal />} />
			<Window content={<Terminal />} />
			{/* {graphicalProcesses.map(
				(gip) =>
					gip.content && <Window key={gip.id} content={gip.content.component} />
			)} */}
		</div>
	);
}
