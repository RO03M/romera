import { useEffect, useState } from "preact/hooks";
import { Window } from "../desktop/window/window";
import { Kernel } from "@romos/kernel";
import type { Process } from "@romos/kernel";
import { programTable } from "../../../../programs/program-table";

export function WindowManager() {
	const [processes, setProcesses] = useState<Process[]>([]);

	useEffect(() => {
		Kernel.instance().scheduler.watch("all", ["ran", "killed"], () => {
			console.log("teste");
			const componentProcesses = Kernel.instance().scheduler.processes.filter(
				(process) => process.command === "component"
			);
			setProcesses(componentProcesses);
		});
	}, []);

	console.log(Kernel.instance().scheduler.processes, processes);

	return (
		<>
			{processes.map((process) => {
				const [programName, title, workingDirectory, ...args] = process.args;
				if (!programName || !programTable[programName]) {
					return null;
				}

				const Program = programTable[programName]

				return (<Window
					key={process.pid}
					pid={process.pid}
					Content={Program}
					contentArgs={{
						pid: process.pid,
						title,
						workingDirectory,
						args: args
					}}
				/>)
			}

			)}
		</>
	);
}
