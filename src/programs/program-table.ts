import type { ComponentType } from "preact/compat";
import { Terminal } from "../@core/components/os/terminal/terminal";
import { Explorer } from "./explorer/explorer";
import { CodeEditor } from "./code-editor";
import type { ProcessComponentProps } from "../@core/processes/types";
import { ImageViewer } from "./image-viewer";
import { PdfViewer } from "./pdf-viewer";
import { VideoViewer } from "./video-viewer";

export const programTable: Record<
	string,
	ComponentType<ProcessComponentProps>
> = {
	terminal: Terminal,
	explorer: Explorer,
	monaco: CodeEditor,
	imageviewer: ImageViewer,
	videoViewer: VideoViewer,
	pdfviewer: PdfViewer
};
