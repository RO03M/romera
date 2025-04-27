import { type HydrationData, normalize } from "@romos/fs";
import { Kernel } from "@romos/kernel";
import { safe } from "./@core/utils/safe";

async function buildDir(basepath: string, nodes: HydrationData[]) {
	for (const node of nodes) {
		if (node.type !== "dir") {
			continue;
		}
		const path = `${basepath}${node.name}`;

		Kernel.instance().filesystem.mkdir(path);

		if (node.nodes && node.nodes.length > 0) {
			buildDir(path, node.nodes);
		}
	}
}

async function buildFiles(basepath: string, nodes: HydrationData[]) {
	for (const node of nodes) {
		const path = normalize(`${basepath}${node.name}`);
		if (node.type === "dir") {
			if (node.nodes && node.nodes.length > 0) {
				await buildFiles(path, node.nodes);
			}
			continue;
		}

		if (node.type === "file") {
			if (node.content === undefined) {
				node.content = "";
			}

			if (Array.isArray(node.content)) {
				await Kernel.instance().filesystem.writeFile(path, new Uint8Array(node.content));
				continue;
			}

			await Kernel.instance().filesystem.writeFile(path, node.content);
		} else if (node.type === "symlink" && node.target !== undefined) {
			if (Kernel.instance().filesystem.stat(path) === null) {
				await Kernel.instance().filesystem.writeFile(node.target, "");
			}
			Kernel.instance().filesystem.symlink(node.target, path);
		}
	}
}

export async function bootstrap() {
    const superblock = await Kernel.instance().filesystem.backend.loadSuperblock();

    // if (superblock !== undefined) {
    //     Kernel.instance().filesystem.root = superblock;
    //     Kernel.instance().filesystem.watcher.emit("/home/romera/desktop", "change");
    //     return;
    // }

    const defaultSuperblockJson = await safe(
        fetch("/filesystem/default.json").then((response) => response.json())
    );

    if (defaultSuperblockJson.error) {
        console.log(defaultSuperblockJson.error);
        return;
    }

    buildDir("", defaultSuperblockJson.data.nodes);
    await buildFiles("", defaultSuperblockJson.data.nodes);
    Kernel.instance().filesystem.watcher.emit("/home/romera/desktop", "change");
}
