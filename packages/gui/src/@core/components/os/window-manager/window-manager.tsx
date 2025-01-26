import { useEffect, useState } from "preact/hooks";
import { Window } from "../desktop/window/window";
import { Kernel } from "@romos/kernel";
import type { Process } from "@romos/kernel/dist/process/process";
import { programTable } from "../../../../programs/program-table";

export function WindowManager() {
	const [processes, setProcesses] = useState<Process[]>([]);

	useEffect(() => {
		Kernel.instance().scheduler.watch("all", ["ran", "killed"], () => {
			const componentProcesses = Kernel.instance().scheduler.processes.filter(
				(process) => process.command === "component"
			);
			setProcesses(componentProcesses);
		});
	}, []);

	console.log(processes, Kernel.instance().scheduler.processes);

	return (
		<>
			{processes.map((process) => (
				<Window
					key={process.pid}
					pid={process.pid}
					Content={programTable[process.args?.[0]]}
					contentArgs={process.args}
				/>
			))}
		</>
	);
}
