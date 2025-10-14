import { Kernel } from "@romos/kernel";
import { DEFAULT_MIME, MIMEMAP } from "./mimemap";

export class BlobManager {
    private blobCache = new Map<string, string>();
    private static _instance: BlobManager;

    public static instance(): BlobManager {
        if (BlobManager._instance === undefined) {
            BlobManager._instance = new BlobManager();
        }

        return BlobManager._instance
    }

    public async get(filepath: string): Promise<string | null> {
        if (filepath === "") {
            return null;
        }

        const cache = this.blobCache.get(filepath);
        if (cache) {
            return cache;
        }

        const buffer = await Kernel.instance().filesystem.readFile(filepath);
            
        if (buffer === null || typeof buffer === "string") {
            return null;
        }
        
        const blobUrl = URL.createObjectURL(new Blob([buffer as BlobPart], { type: MIMEMAP.get(filepath) ?? DEFAULT_MIME }));

        this.blobCache.set(filepath, blobUrl);

        return blobUrl;
    }
}