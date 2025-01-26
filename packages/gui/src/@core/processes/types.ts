import type { Process } from "./process";

export interface ProcessComponentProps {
	pid: Process["pid"];
	title?: string;
	workingDirectory?: string;
	args: string[];
}

export interface ProcessOptions {
	/**
	 * Callback that will be fired whenever the process is going to die
	 */
	onTerminate?: () => void;
	/**
	 * Current working directory
	 */
	cwd?: string;
	/**
	 * In milliseconds the maximum amount of time the process is allowed to run.
	 */
	timeout?: number;

	tty?: number;
}

interface SyscallStream {
	type: "SYSCALL";
	method: string;
	args: unknown[];
	responseId: string;
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
		"responseId" in data;

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
