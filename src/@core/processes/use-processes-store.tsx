import { create } from "zustand";
import type { Process, TTYContext } from "./types";
import { incrementalId } from "../utils/incremental-id";

interface ProcessesStore {
	processes: Process[];
	createProcess: (cmd: string, ttyContext: TTYContext) => Process;
	setPidsToRunning: (pids: Process["pid"][]) => void;
	killProcesses: (pids: Process["pid"][]) => void;
}

export const useProcessesStore = create<ProcessesStore>()((set, get) => ({
	createProcess(cmd: string, ttyContext: TTYContext) {
		const process: Process = {
			pid: incrementalId("process"),
			status: "created",
			cmd,
            ttyContext
		};

		const processes = get().processes;
		processes.push(process);

		set({ processes });

		return process;
	},
	setPidsToRunning(pids) {
		const processes = get().processes;

		for (const pid of pids) {
			const index = processes.findIndex((process) => process.pid === pid);
			processes[index].status = "running";
		}
		
		set({ processes });
	},
	killProcesses(pids) {
		const processes = get().processes.filter((process) => {
			return !pids.includes(process.pid);
		});

		set({ processes });
	},
	processes: []
}));
