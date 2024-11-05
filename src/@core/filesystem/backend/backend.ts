import type { FSMap } from "../filesystem";
import { IDB } from "./idb";

export class FSBackend {
	private idb: IDB;

	constructor() {
		this.idb = new IDB();
	}

	public async writeFile(inode: number, data: Uint8Array) {
		return await this.idb.writeFile(inode, data);
	}

	public async readFile(inode: number) {
		const file = await this.idb.readFile(inode);

		return file?.data;
	}

	public async saveSuperblock(data: FSMap) {
		await this.idb.saveSuperblock(data);
	}

	public async loadSuperblock() {
		const superblock = await this.idb.getSuperblock();

		return superblock?.data;
	}
}
