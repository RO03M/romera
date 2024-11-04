import Dexie, { type EntityTable } from "dexie";
import { safe } from "../../utils/safe";
import type { FSMap } from "../filesystem";
import { IDB } from "./idb";

export class FSBackend {
	private idb: IDB;

	constructor() {
		this.idb = new IDB();
	}

	public writeFile(inode: number, data: Uint8Array) {}

	public saveSuperblock(data: FSMap) {
		this.idb.saveSuperblock(data);
	}
}
