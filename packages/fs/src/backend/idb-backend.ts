import type { FSMap } from "../filesystem";
import { Stat } from "../stat";
import type { Backend } from "./backend";
import { IDB } from "./idb";

export class IDBBackend implements Backend {
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

	/**
	   @description when saved to the indexeddb, the classes are transformed into an object, so I have to fucking transform those fuckers
	*/
	private formatSuperblock(data: FSMap) {
		const blockmap: FSMap = new Map();
		for (const [key, value] of data.entries()) {
			if (key === 0) {
				blockmap.set(key, Stat.fromObject(value as Stat));
			} else {
				blockmap.set(key, this.formatSuperblock(value as FSMap));
			}
		}

		return blockmap;
	}

	public async saveSuperblock(data: FSMap) {
		await this.idb.saveSuperblock(data);
	}

	public async loadSuperblock() {
		const superblock = await this.idb.getSuperblock();

		if (superblock !== undefined) {
			return this.formatSuperblock(superblock.data);
		}

		return superblock;
	}
}
