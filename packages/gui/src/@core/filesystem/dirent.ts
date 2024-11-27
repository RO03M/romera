import type { Stat } from "./stat";

export class Dirent {
	public name: string;
	public type: Stat["type"];
	public inode: Stat["inode"];

	constructor(name: string, inode: Stat["inode"], type: Stat["type"]) {
		this.name = name;
		this.type = type;
		this.inode = inode;
	}
}
