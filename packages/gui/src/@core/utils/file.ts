import { filesystem } from "../../app";
import { extname } from "@romos/fs";

export async function fileToBuffer(file: File) {
	const buffer = await file
		.arrayBuffer()
		.then((buffer) => new Uint8Array(buffer));

	return buffer;
}

function mimeTypeFromFile(filepath: string) {
	const extension = extname(filepath);

	switch (extension) {
		case ".png":
			return "image/png";
		case ".jpeg":
		case ".jpg":
			return "image/jpeg";
		case ".gif":
			return "image/gif";
		case ".ico":
			return "image/vnd.microsoft.icon";
		case ".svg":
			return "image/svg+xml";
		case ".webp":
			return "image/webp";
		case ".htm":
		case ".html":
			return "text/html";
		case ".pdf":
			return "application/pdf";
		default:
			return "";
	}
}

export async function blobFromFile(filepath: string) {
    const buffer = await filesystem.readFile(filepath);
    
	if (buffer === null || typeof buffer === "string") {
		return null;
	}

    return URL.createObjectURL(new Blob([buffer], { type: mimeTypeFromFile(filepath) }));
}