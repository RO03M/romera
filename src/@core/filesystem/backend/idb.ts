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

	public writeFile(inode: number, data: Uint8Array) {}

    private superblockTable() {
        const table = this.db.tables.find((table) => table.name === "superblock");

        return table;
    }

    public async saveSuperblock(data: FSMap) {
        console.log(data);
        await this.superblockTable()?.put({ id: "root", data }, "root");
    }

    public async getSuperblock() {
        const superblock = await this.superblockTable()?.get("root");

        return superblock;
    }
}
