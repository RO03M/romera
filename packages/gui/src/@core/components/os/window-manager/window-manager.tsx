import { useEffect, useState } from "preact/hooks";
import { Window } from "../desktop/window/window";
import type { Process } from "../../../processes/process";
import { Kernel } from "@romos/kernel";

export function WindowManager() {
	const [processes, setProcesses] = useState<Process[]>([]);

	useEffect(() => {
		Kernel.instance().scheduler.watch("all", ["ran", "killed"], () => {
			// TODO buscar componente de acordo com o 1º argumento do comando "component"
			// setProcesses(
			// 	Kernel.instance().scheduler.processes.filter(
			// 		(processes) => processes.Component !== undefined
			// 	)
			// );
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
