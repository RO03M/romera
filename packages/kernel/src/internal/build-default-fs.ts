import { readFileSync } from "node:fs";
import { Kernel } from "../kernel";
import { cat, ls, sleep, mkdir, watch } from "../bin/programs";
import { touch } from "../bin/programs/touch";
import { prog_pwd } from "../bin/programs/pwd";
import { addDoom } from "./desktop/doom";

export async function buildFs() {
    const filesystem = Kernel.instance().filesystem;
    filesystem.mkdir("/bin");
    filesystem.mkdir("/home");
    filesystem.mkdir("/home/romera");
    filesystem.mkdir("/home/romera/desktop");
    filesystem.mkdir("/usr");
    filesystem.mkdir("/usr/applications");
    filesystem.mkdir("/usr/games");
    filesystem.writeFile("/bin/ls", ls.toString());
    filesystem.writeFile("/bin/cat", cat.toString());
    filesystem.writeFile("/bin/mkdir", mkdir.toString());
    filesystem.writeFile("/bin/sleep", sleep.toString());
    filesystem.writeFile("/bin/watch", watch.toString());
    filesystem.writeFile("/bin/touch", touch.toString());
    filesystem.writeFile("/bin/pwd", prog_pwd.toString());

    filesystem.writeFile("/usr/applications/Projetos", "[Desktop Entry];\nx=0;\ny=1;");

    filesystem.mkdir("/home/romera/desktop/Projetos");

    await addDoom();

    const ubuntu22 = readFileSync(`${__dirname}/wallpapers/ubuntu-22.jpg`);
    const windows98 = readFileSync(`${__dirname}/wallpapers/windows-98.jpg`);

    filesystem.mkdir("/usr/system");
    filesystem.mkdir("/usr/system/wallpapers");
    await filesystem.writeFile("/usr/system/wallpapers/ubuntu-22.jpg", ubuntu22);
    await filesystem.writeFile("/usr/system/wallpapers/windows-98.jpg", windows98);
    filesystem.symlink("/usr/system/wallpapers/windows-98.jpg", "/usr/system/wallpaper");
}
