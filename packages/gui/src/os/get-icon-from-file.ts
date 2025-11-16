import { basename, extname, filename, Stat } from "@romos/fs";
import { System } from "./system";
import { DotDesktop } from "./dot-desktop";
import { BlobManager } from "../blob-manager";

export async function getIconBlobFromFile(filepath: string, type: Stat["type"] = "file") {
    const system = await System.load();
    const dotDesktop = await DotDesktop.load();

    const ext = extname(filepath);
    const base = basename(filepath)

    const defaultIconPath = system.getDefaultIcon(filepath, type);
    const customIconPath = dotDesktop.getByName(base)?.icon;
    const iconPath = customIconPath ? customIconPath : defaultIconPath;
    const iconBlob = await BlobManager.instance().get(iconPath);

    return iconBlob;
}