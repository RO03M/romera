export type StatType = "file" | "dir" | "symlink";

export interface HydrationData {
	name: string;
	type: StatType;
	target?: string;
	content?: string;
	nodes?: HydrationData[];
}

export interface ReadFileOptions {
	decode?: boolean;
}

export interface ReadDirOptions {
	withFileTypes?: boolean;
}
