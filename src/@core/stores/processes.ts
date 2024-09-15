// import { signal } from "@preact/signals";

// enum ProcessState {
// 	RUNNING = 0,
// 	SLEEPING = 1,
// 	EFFICIENCY = 2
// }

// interface Process<
// 	ProcessDetails extends Record<string, unknown> = Record<string, unknown>
// > {
// 	pid: number;
// 	user: string;
// 	cmd: string;
// 	cpu_usage?: number;
// 	state: ProcessState;
// 	details?: ProcessDetails;
// }

// export const processes = signal<Process<Record<string, unknown>>[]>([
// 	{
// 		cmd: "~",
// 		pid: 1,
// 		state: ProcessState.SLEEPING,
// 		user: "root",
// 		cpu_usage: 0
// 	}
// ]);
