import { Kernel } from "@romos/kernel";
import { useCallback, useEffect, useState } from "preact/hooks";
import { blobFromFile } from "../utils/file";
import { safe } from "../utils/safe";

export function useWallpaper() {
    const [blobUrl, setBlobUrl] = useState<string | undefined>();

    const fetchWallpaper = useCallback(async () => {
        const systemFile = await Kernel.instance().filesystem.readFile("/usr/system", {
            decode: true
        });
        
        const systemJson = safe(() => JSON.parse(systemFile ?? "{}"));
    
        const wallpaperPath = systemJson.data?.wallpaper;
        
        const wallpaperBlob = await blobFromFile(wallpaperPath);

        if (wallpaperBlob !== null) {
            setBlobUrl(wallpaperBlob);
        }
    }, []);

    useEffect(() => {
        fetchWallpaper();
        Kernel.instance().filesystem.watch("/usr/system", fetchWallpaper);
    }, [fetchWallpaper]);

    return blobUrl;
}