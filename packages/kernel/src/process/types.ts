import type { Process } from "./process";

export interface ProcessComponentProps {
	pid: Process["pid"];
	title?: string;
	workingDirectory?: string;
}

interface SyscallStream {
	type: "SYSCALL";
	method: string;
	args: unknown[];
	syscallId: string;
}

export function isSyscallStream(data: unknown): data is SyscallStream {
	const isObject = typeof data === "object" && data !== null;
	if (!isObject) {
		return false;
	}

	const hasParameters =
		"type" in data &&
		"method" in data &&
		"args" in data &&
		"syscallId" in data;

	if (!hasParameters) {
		return false;
	}

	if (data.type !== "SYSCALL") {
		return false;
	}

	return true;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type SyscallMethod = (...args: any[]) => unknown | Promise<unknown>;
