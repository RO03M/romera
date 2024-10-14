export type StatType = "file" | "dir" | "symlink";

export interface HydrationData {
	name: string;
	type: string;
	target?: string;
	content?: string | Uint8Array | number[];
	nodes?: HydrationData[];
}

export interface MakeDirectoryOptions {
	parents?: boolean;
}

export interface ReadFileOptions {
	decode?: boolean;
}

export interface ReadDirOptions {
	withFileTypes?: boolean;
}

export type WatchEvent = "change" | "deleted" | "rename" | "created";

export type WatchCallback = (event: WatchEvent) => void;