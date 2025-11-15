import { useEffect, useState } from "preact/hooks";
import { Window } from "../desktop/window/window";
import { Kernel } from "@romos/kernel";
import type { Process } from "@romos/kernel";
import { programTable } from "../../../../programs/program-table";
import { extname } from "@romos/fs";

export function WindowManager() {
	const [processes, setProcesses] = useState<Process[]>([]);

	useEffect(() => {
		Kernel.instance().scheduler.watch("all", ["ran", "killed"], () => {
			const componentProcesses: Process[] = [];
			for (const [_key, process] of Kernel.instance().scheduler.processes) {
				if (process.command === "component") {
					componentProcesses.push(process);
				}
			}

			setProcesses(componentProcesses);
		});
	}, []);

	return (
		<>
			{processes.map((process) => {
				const linkStat = Kernel.instance().filesystem.lstat(process.cwd);
				
				const extension = extname(linkStat?.target ?? "")?.split(".")?.pop();

				const [programName, title, workingDirectory, ...args] = process.args;

				const Program = programTable[extension ?? programName];

				return (
					<Window
						key={process.pid}
						pid={process.pid}
						Content={Program}
						contentArgs={{
							pid: process.pid,
							title,
							workingDirectory,
							args: args
						}}
					/>
				);
			})}
		</>
	);
}
