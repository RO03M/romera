import { TerminalProgram } from "../@core/components/os/terminal/terminal";
import { Explorer } from "./explorer/explorer";
import { CodeEditor } from "./code-editor";
import { ImageViewer } from "./image-viewer";
import { PdfViewer } from "./pdf-viewer";
import { VideoViewer } from "./video-viewer";
import DosPlayer from "./emulators/dos-player";
import type { ReactNode } from "preact/compat";
import { Canvas } from "./canvas";
import { ProcessManager } from "./process-manager";
import type { ProcessComponentProps } from "./types";

export const programTable: Record<
	string,
	(props: ProcessComponentProps) => ReactNode
> = {
	terminal: TerminalProgram,
	explorer: Explorer,
	monaco: CodeEditor,
	imageviewer: ImageViewer,
	videoViewer: VideoViewer,
	pdfviewer: PdfViewer,
	jsdos: DosPlayer,
	canvas: Canvas,
	psman: ProcessManager
};

export function isMagicProgram(
	programName: string
): programName is keyof typeof programTable {
	return programName in programTable;
}
