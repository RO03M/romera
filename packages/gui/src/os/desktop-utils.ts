import { Kernel } from "@romos/kernel";
import { DotDesktop } from "./dot-desktop";

export async function createDesktopFile(filename: string, data: string | Uint8Array<ArrayBufferLike>) {
    await Kernel.instance().filesystem.writeFile(`/home/romera/desktop/${filename}`, data);
    await updateDotDesktop(filename);
}

export async function createDesktopDir(dirname: string) {
    let index = 0;

    if (Kernel.instance().filesystem.stat(`/home/romera/desktop/${dirname}`) === null) {
        Kernel.instance().filesystem.mkdir(`/home/romera/desktop/${dirname}`);

        await updateDotDesktop(dirname);
        return;
    }

    while (Kernel.instance().filesystem.stat(`/home/romera/desktop/${dirname} (${index})`) !== null) {
        index++;
    }

    Kernel.instance().filesystem.mkdir(`/home/romera/desktop/${dirname} (${index})`);

    await updateDotDesktop(`${dirname} (${index})`);
}

export async function updateDotDesktop(name: string) {
    const dotDesktop = await DotDesktop.load();
    
    const [x, y] = dotDesktop.getEmptyCell(10, 10);
    console.log(name, x, y);

    dotDesktop.add(name, x, y, {});

    await dotDesktop.save();
}