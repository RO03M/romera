import type { ComponentType } from "preact";

export interface ProcessComponentProps {
	title?: string;
	workingDirectory?: string;
}

export interface TTYContext {
	id: number;
	workingDirectory: string;
	echo: (message: string) => void;
	pendingMode: () => void;
	free: () => void;
}

type ProcessStatus = "created" | "running" | "stopped" | "zombie" | "sleeping";

export interface Process {
	pid: number;
	status: ProcessStatus;
	args?: string[];
	program?: string;
	ttyContext?: TTYContext;
	// Reference to the terminal that the command was generated (Should be used to show the output to the correct terminal)
	tty?: unknown;
	// If the process is a command generated in the shell
	cmd?: string;
	// If the process is generated after the user opens a new window
	Component?: ComponentType<ProcessComponentProps>;
	componentArgs?: ProcessComponentProps;
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
export type SyscallMethod = (...args: any[]) => unknown;
