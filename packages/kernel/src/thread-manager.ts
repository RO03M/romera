import type { Process } from "./process/process";

export interface ThreadManager {
	spawn(process: Process): Promise<void>;
}
