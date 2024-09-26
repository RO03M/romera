import type { ComponentType } from "preact/compat";
import { Terminal } from "../@core/components/os/terminal/terminal";
import { Explorer } from "./explorer/explorer";
import { CodeEditor } from "./code-editor";
import type { ProcessComponentProps } from "../@core/processes/types";

export const programTable: Record<
	string,
	ComponentType<ProcessComponentProps>
> = {
	terminal: Terminal,
	explorer: Explorer,
	monaco: CodeEditor
};
