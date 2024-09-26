import { useMemo } from "preact/hooks";
import { Window } from "../desktop/window/window";
import { useProcessesStore } from "../../../processes/use-processes-store";

export function WindowManager() {
	const { processes } = useProcessesStore();

	const windowProcesses = useMemo(() => {
		return processes.filter((process) => process.Component !== undefined);
	}, [processes]);

	return (
		<div id={"window-manager"}>
			{windowProcesses.map((process) => (
				<Window key={process.pid} pid={process.pid} Content={process.Component} contentArgs={process.componentArgs} />
			))}
		</div>
	);
}
