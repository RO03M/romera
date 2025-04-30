import { FSMap } from "../filesystem";

export interface Backend {
    writeFile(inode: number, data: Uint8Array): Promise<number>;
    readFile(inode: number): Promise<Uint8Array | undefined>;
    saveSuperblock(data: FSMap): Promise<void>;
    loadSuperblock(): Promise<FSMap | undefined>;
}