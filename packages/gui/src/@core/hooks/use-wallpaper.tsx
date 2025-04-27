import { Kernel } from "@romos/kernel";
import { useEffect, useState } from "preact/hooks";
import { blobFromFile } from "../utils/file";

export function useWallpaper() {
    const [blobUrl, setBlobUrl] = useState<string | undefined>();

    useEffect(() => {
        Kernel.instance().filesystem.watch("/usr/system/wallpaper", async () => {
            const wallpaperBlob = await blobFromFile("/usr/system/wallpaper");

            if (wallpaperBlob !== null) {
                setBlobUrl(wallpaperBlob);
            }
        });
    }, []);

    return blobUrl;
}