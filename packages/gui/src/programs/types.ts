import type { Process } from "@romos/kernel";

export interface ProcessComponentProps {
	pid: Process["pid"];
	title?: string;
	workingDirectory?: string;
	args: string[];
}

export interface ProcessComponentRef extends HTMLElement {
	onResize?: (width: number, height: number) => void;
	onClose?: () => void;
}
