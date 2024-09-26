import type { ComponentType } from "preact";

interface ProcessComponentProps {
	title?: string;
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
	ttyContext: TTYContext;
	// Reference to the terminal that the command was generated (Should be used to show the output to the correct terminal)
	tty?: unknown;
	// If the process is a command generated in the shell
	cmd: string;
	// If the process is generated after the user opens a new window
	Component?: ComponentType<ProcessComponentProps>;
}
