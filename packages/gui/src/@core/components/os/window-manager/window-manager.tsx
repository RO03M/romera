import { useEffect, useState } from "preact/hooks";
import { Window } from "../desktop/window/window";
import { processScheduler } from "../../../../app";
import type { Process } from "../../../processes/process";

export function WindowManager() {
	const [processes, setProcesses] = useState<Process[]>([]);

	useEffect(() => {
		processScheduler.watch("all", ["ran", "killed"], () => {
			setProcesses(
				processScheduler.processes.filter(
					(processes) => processes.Component !== undefined
				)
			);
		});
	}, []);

	return (
		<>
			{processes.map((process) => (
				<Window
					key={process.pid}
					pid={process.pid}
					Content={process.Component}
					contentArgs={process.componentArgs}
				/>
			))}
		</>
	);
}
