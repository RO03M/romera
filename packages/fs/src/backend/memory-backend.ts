import { FSMap } from "../filesystem";
import { Backend } from "./backend";

export class MemoryBackend implements Backend {
    private inodeTable = new Map<number, Uint8Array>;
    private block: FSMap | undefined;

    async writeFile(inode: number, data: Uint8Array): Promise<number> {
        this.inodeTable.set(inode, data);
        return inode;
    }
    async readFile(inode: number): Promise<Uint8Array | undefined> {
        return this.inodeTable.get(inode);
    }

    async saveSuperblock(data: FSMap): Promise<void> {
        this.block = data;
        return;
    }

    async loadSuperblock(): Promise<FSMap | undefined> {
        return this.block;
    }

}