// import { create } from "zustand";
// import type { Process, ProcessComponentProps, TTYContext } from "./types";
// import { incrementalId } from "../utils/incremental-id";
// import type { ComponentType } from "preact";
// import { programTable } from "../../programs/program-table";

// interface ProcessesStore {
// 	processes: Process[];
// 	createProcess: (cmd: string, ttyContext: TTYContext) => Process;
// 	createWindowProcess: (
// 		Component: ComponentType<ProcessComponentProps>,
// 		args: ProcessComponentProps
// 	) => Process;
// 	createWindowProcessFromProgramTable: (
// 		componentName: string,
// 		args: ProcessComponentProps
// 	) => Process | null;
// 	setPidsToRunning: (pids: Process["pid"][]) => void;
// 	killProcesses: (pids: Process["pid"][]) => void;
// }

// export const useProcessesStore = create<ProcessesStore>()((set, get) => ({
// 	createProcess(cmd: string, ttyContext: TTYContext) {
// 		const process: Process = {
// 			pid: incrementalId("process"),
// 			status: "created",
// 			cmd,
// 			ttyContext
// 		};

// 		const processes = get().processes;
// 		processes.push(process);

// 		set({ processes });

// 		return process;
// 	},
// 	createWindowProcess(Component, args) {
// 		const process: Process = {
// 			pid: incrementalId("process"),
// 			status: "created",
// 			Component,
// 			componentArgs: args
// 		};

// 		const processes = get().processes;
// 		processes.push(process);

// 		set({ processes: [...processes] });

// 		return process;
// 	},
// 	createWindowProcessFromProgramTable(componentName, args) {
// 		const Component = programTable[componentName];

// 		if (Component === undefined) {
// 			return null;
// 		}

// 		const process: Process = {
// 			pid: incrementalId("process"),
// 			status: "created",
// 			Component,
// 			componentArgs: args
// 		};

// 		const processes = get().processes;
// 		processes.push(process);

// 		set({ processes: [...processes] });

// 		return process;
// 	},
// 	setPidsToRunning(pids) {
// 		const processes = get().processes;

// 		for (const pid of pids) {
// 			const index = processes.findIndex((process) => process.pid === pid);
// 			processes[index].status = "running";
// 		}

// 		set({ processes });
// 	},
// 	killProcesses(pids) {
// 		const processes = get().processes.filter((process) => {
// 			return !pids.includes(process.pid);
// 		});

// 		set({ processes });
// 	},
// 	processes: []
// }));
