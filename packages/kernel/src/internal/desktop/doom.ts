import { readFileSync } from "node:fs";
import { Kernel } from "../../kernel";

export async function addDoom() {
    const doomBuffer = readFileSync(`${__dirname}/doom.jsdos`)
    await Kernel.instance().filesystem.writeFile("/usr/games/doom.jsdos", doomBuffer);
    await Kernel.instance().filesystem.writeFile("/usr/applications/Doom", "[Desktop Entry];\nx=0;\ny=2;");
    Kernel.instance().filesystem.symlink("/usr/games/doom.jsdos", "/home/romera/desktop/Doom");
}