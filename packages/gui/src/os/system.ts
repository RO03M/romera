import { Kernel } from "@romos/kernel";
import { safe } from "../@core/utils/safe";
import { extname, type Stat } from "@romos/fs";

export class System {
    public wallpaper = "";
    public icons = new Map<string, string>();
    public programs = new Map<string, string>();

    public static async load(): Promise<System> {
        const systemFile = await Kernel.instance().filesystem.readFile(
            "/usr/system",
            {
                decode: true
            }
        );

        if (systemFile === null) {
            return new System();
        }

        const systemJson = safe(() => JSON.parse(systemFile));

        if (systemJson.error !== null) {
            return new System();
        }

        return System.parse(systemJson.data);
    }

    public static parse(data: Record<string, unknown>): System {
        const system = new System();
        if ("wallpaper" in data && typeof data.wallpaper === "string") {
            system.wallpaper = data.wallpaper;
        }

        if (
            "icons" in data &&
            typeof data.icons === "object" &&
            data.icons !== null
        ) {
            for (const [key, value] of Object.entries(data.icons)) {
                if (typeof value !== "string" || typeof key !== "string") {
                    continue;
                }

                system.icons.set(key, value);
            }
        }

        if (
            "programs" in data &&
            typeof data.programs === "object" &&
            data.programs !== null
        ) {
            for (const [key, value] of Object.entries(data.programs)) {
                if (typeof value !== "string" || typeof key !== "string") {
                    continue;
                }

                system.programs.set(key, value);
            }
        }

        return system;
    }

    public stringify(): string {
        return JSON.stringify({
            wallpaper: this.wallpaper,
            icons: Object.fromEntries(this.icons)
        });
    }

    public getDefaultFileIcon(): string {
        return this.icons.get("file") ?? "";
    }

    public getDefaultFolderIcon(): string {
        return this.icons.get("folder") ?? "";
    }

    public getDefaultIcon(filename: string, type: Stat["type"]): string {
        const extension = extname(filename);

        const custom = this.icons.get(extension ?? "");

        if (custom) {
            return custom;
        }

        const defaultIcon =
            type === "dir" ? this.getDefaultFolderIcon() : this.getDefaultFileIcon();

        return defaultIcon ?? "";
    }

    public getDefaultProgram(filename: string, type: Stat["type"]): string {
        const extension = extname(filename);

        const program = this.programs.get(extension ?? "");

        if (program) {
            return program;
        }

        const defaultProgram =
            type === "dir" ? this.programs.get("folder") : this.programs.get("file");

        return defaultProgram ?? "";
    }
}
