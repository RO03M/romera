import { useGip } from "../../../gip/use-gip";
import { Window } from "../desktop/window/window";

export function WindowManager() {
	const { graphicalProcesses } = useGip();

	return (
		<div id={"window-manager"}>
			{graphicalProcesses.map(
				(gip) =>
					gip.content && <Window key={gip.id} content={gip.content.component} />
			)}
		</div>
	);
}
