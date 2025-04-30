import { Kernel } from "@romos/kernel";
import { useCallback, useEffect, useState } from "preact/hooks";
import { blobFromFile } from "../utils/file";

export function useWallpaper() {
    const [blobUrl, setBlobUrl] = useState<string | undefined>();

    const fetchWallpaper = useCallback(async () => {
        const wallpaperBlob = await blobFromFile("/usr/system/wallpaper");

        if (wallpaperBlob !== null) {
            setBlobUrl(wallpaperBlob);
        }
    }, []);

    useEffect(() => {
        Kernel.instance().filesystem.watch("/usr/system/wallpaper", fetchWallpaper);
    }, [fetchWallpaper]);

    return blobUrl;
}