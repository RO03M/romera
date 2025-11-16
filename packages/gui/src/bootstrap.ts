import { basename } from "@romos/fs";
import { Kernel } from "@romos/kernel";
import { safe } from "./@core/utils/safe";
import { DotDesktop } from "./os/dot-desktop";

async function setupDotDesktop() {
	const entries = Kernel.instance().filesystem.readdir(
		"/home/romera/desktop",
		{ withFileTypes: true }
	);

	const dotDesktop = await DotDesktop.load();

	for (const entry of entries) {
		const entryName = basename(entry.name);

		if (dotDesktop.hasName(entryName)) {
			continue;
		}

		const [x, y] = dotDesktop.getEmptyCell(10, 10);

		dotDesktop.add(entryName, x, y, {});
	}

	await dotDesktop.save();
}

export async function bootstrap() {
    const superblock = await Kernel.instance().filesystem.backend.loadSuperblock();

    if (superblock !== undefined) {
		Kernel.instance().filesystem.setRoot(superblock);
		Kernel.instance().filesystem.watcher.emit("/home/romera/desktop", "change");
		Kernel.instance().filesystem.watcher.emit("/usr/system/wallpaper", "change"); // me odeio
		await setupDotDesktop();

        return;
    }

    const defaultSuperblock = await safe(
        fetch("/filesystem/fsbin").then((response) => response.bytes())
    );

    if (defaultSuperblock.error) {
        console.log(defaultSuperblock.error);
        return;
    }

	const ds = new DecompressionStream("deflate");
	const writer = ds.writable.getWriter();
	writer.write(defaultSuperblock.data);
	writer.close();
	const uncompressed = await new Response(ds.readable).arrayBuffer();
	
	await Kernel.instance().filesystem.import(new Uint8Array(uncompressed));

	await setupDotDesktop();
    Kernel.instance().filesystem.watcher.emit("/home/romera/desktop", "change");
}
