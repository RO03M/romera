import type { HydrationData } from "@romos/fs";
import { fileToBuffer } from "./file";

async function getFileFromFileEntry(entry: FileSystemFileEntry) {
	return new Promise<HydrationData | null>((resolve) => {
		entry.file(
			async (file) => {
				const buffer = await fileToBuffer(file);
				resolve({
					name: file.name,
					type: "file",
					content: buffer
				});
			},
			() => resolve(null)
		);
	});
}

async function getDirFromDirEntry(
	entry: FileSystemDirectoryEntry
): Promise<HydrationData> {
	const reader = entry.createReader();

	const children: HydrationData["nodes"] = [];

	reader.readEntries(async (entries) => {
		for (const entry of entries) {
			if (entry.isFile) {
				const file = await getFilesFromEntry(entry);
				if (file !== null && file !== undefined) {
					children.push(file);
				}
			} else if (entry.isDirectory) {
				const dir = await getDirFromDirEntry(entry as FileSystemDirectoryEntry);
				children.push(dir);
			}
		}
	});

	return {
		name: entry.name,
		type: "dir",
		nodes: children
	};
}

async function getFilesFromEntry(
	entry: FileSystemEntry
): Promise<HydrationData | null> {
	if (entry.isFile) {
		const file = await getFileFromFileEntry(entry as FileSystemFileEntry);
		return file;
	}

	if (entry.isDirectory) {
		const dir = await getDirFromDirEntry(entry as FileSystemDirectoryEntry);
		return dir;
	}

	return null;
}

export async function getFilesFromDataTransferItems(
	items: DataTransferItemList
) {
	const entries: FileSystemEntry[] = [];
	const formattedData: HydrationData[] = [];
	for (const item of items) {
		const entry = item.webkitGetAsEntry();
		if (entry !== null) {
			entries.push(entry);
		}
	}

	for (const entry of entries) {
		const formattedEntries = await getFilesFromEntry(entry);
		if (formattedEntries !== null) {
			formattedData.push(formattedEntries);
		}
	}

	return formattedData;
}
