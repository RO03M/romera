
import { Terminal } from "../@core/components/os/terminal/terminal";
import { Explorer } from "./explorer/explorer";
import { CodeEditor } from "./code-editor";
import { ImageViewer } from "./image-viewer";
import { PdfViewer } from "./pdf-viewer";
import { VideoViewer } from "./video-viewer";

export const programTable = {
	terminal: Terminal,
	explorer: Explorer,
	monaco: CodeEditor,
	imageviewer: ImageViewer,
	videoViewer: VideoViewer,
	pdfviewer: PdfViewer
};

export function isMagicProgram(programName: string): programName is keyof typeof programTable {
	return programName in programTable;
}
