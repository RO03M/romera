import Dexie, { type EntityTable } from "dexie";
import type { FSMap } from "../filesystem";

type DexieWithTables = Dexie & {
	inodetable: EntityTable<{ inode: number; data: Uint8Array }, "inode">;
	superblock: EntityTable<{ id: "root"; data: FSMap }, "id">;
};

export class IDB {
	private db: DexieWithTables;

	constructor() {
		this.db = new Dexie("romos-fs") as DexieWithTables;
		this.db.version(1).stores({
			inodetable: "inode, data",
			superblock: "id, data"
		});
	}

	public async writeFile(inode: number, data: Uint8Array) {
        return await this.db.inodetable.put({ inode, data }, inode);
    }

    public async readFile(inode: number) {
        return await this.db.inodetable.where("inode").equals(inode).first();
    }

    public async saveSuperblock(data: FSMap) {
        return await this.db.superblock?.put({ id: "root", data }, "root");
    }

    public async getSuperblock() {
        const superblock = await this.db.superblock?.get("root");

        return superblock;
    }
}
