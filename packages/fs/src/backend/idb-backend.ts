import type { FSMap } from "../filesystem";
import { Stat } from "../stat";
import type { Backend } from "./backend";
import { IDB } from "./idb";

export class IDBBackend implements Backend {
	private idb: IDB;
	private cache = new Map<number, Uint8Array>();

	constructor() {
		this.idb = new IDB();
	}

	private cacheIt(inode: number, data: Uint8Array) {
		if (data.byteLength < 10 * 1024 * 1024) { // 10MB
			this.cache.set(inode, data);
		}
	}

	public async writeFile(inode: number, data: Uint8Array) {
		if (this.cache.has(inode)) {
			this.cache.delete(inode);
		}

		this.cacheIt(inode, data);
		
		return await this.idb.writeFile(inode, data);
	}

	public async readFile(inode: number) {
		const cache = this.cache.get(inode);

		if (cache) {
			return cache;
		}

		const file = await this.idb.readFile(inode);

		if (file?.data !== undefined) {
			this.cacheIt(inode, file.data);
		}

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
