import type { StatType } from "./types";

export class Stat {
	public type: StatType;
	public inode: number;
	public size: number;
	public target?: string;

	constructor(type: StatType, inode: number, size: number, target?: string) {
		this.type = type;
		this.inode = inode;
		this.size = size;
		if (this.type === "symlink") {
			this.target = target;
		}
	}

	public isDirectory() {
		return this.type === "dir";
	}

	public isFile() {
		return this.type === "file";
	}

	public isSymlink() {
		return this.type === "symlink";
	}
}
