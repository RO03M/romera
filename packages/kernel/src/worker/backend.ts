import type { Process } from "../process/process";

export interface WorkerBackend {
	spawn(process: Process): Promise<void>;
}
