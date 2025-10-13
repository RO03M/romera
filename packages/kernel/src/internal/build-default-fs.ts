import { readFileSync } from "node:fs";
import { Kernel } from "../kernel";
import { cat, ls, sleep, mkdir, watch } from "../bin/programs";
import { touch } from "../bin/programs/touch";
import { prog_pwd } from "../bin/programs/pwd";
import { addDoom } from "./desktop/doom";
import type { Filesystem } from "@romos/fs";

export async function buildImages(filesystem: Filesystem) {
	const ubuntu22 = readFileSync(`${__dirname}/images/ubuntu-22.jpg`);
	const windows98 = readFileSync(`${__dirname}/images/windows-98.jpg`);
	const firefoxIcon = readFileSync(`${__dirname}/images/firefox.png`);
	const folder = readFileSync(`${__dirname}/images/folder.png`);
	const unknownFile = readFileSync(`${__dirname}/images/unknown-file.png`);
	const pdf = readFileSync(`${__dirname}/images/pdf.png`);

	filesystem.mkdir("/usr/wallpapers");
	filesystem.mkdir("/usr/icons");

	await filesystem.writeFile("/usr/wallpapers/ubuntu-22.jpg", ubuntu22);
	await filesystem.writeFile("/usr/wallpapers/windows-98.jpg", windows98);
	await filesystem.writeFile("/usr/icons/firefox.png", firefoxIcon);
	await filesystem.writeFile("/usr/icons/folder.png", folder);
	await filesystem.writeFile("/usr/icons/unknown-file.png", unknownFile);
	await filesystem.writeFile("/usr/icons/pdf.png", pdf);

	await filesystem.writeFile(
		"/usr/system",
		JSON.stringify(
			{
				wallpaper: "/usr/wallpapers/windows-98.jpg",
				icons: {
					folder: "/usr/icons/folder.png",
					file: "/usr/icons/unknown-file.png",
					".html": "/usr/icons/firefox.png",
					".pdf": "/usr/icons/pdf.png"
				}
			},
			null,
			4
		)
	);
}

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

	filesystem.writeFile(
		"/usr/applications/Projetos",
		"[Desktop Entry];\nx=0;\ny=1;"
	);

	filesystem.mkdir("/home/romera/desktop/Projetos");

	const resume = readFileSync(`${__dirname}/desktop/resume-pt.pdf`);
	await filesystem.writeFile("/home/romera/desktop/currículo.pdf", resume);
	
	await addDoom();

	await buildImages(filesystem);

    // const ubuntu22 = readFileSync(`${__dirname}/images/ubuntu-22.jpg`);
    // const windows98 = readFileSync(`${__dirname}/images/windows-98.jpg`);

    // filesystem.mkdir("/usr/system");
    // filesystem.mkdir("/usr/system/wallpapers");
    // await filesystem.writeFile("/usr/system/wallpapers/ubuntu-22.jpg", ubuntu22);
    // await filesystem.writeFile("/usr/system/wallpapers/windows-98.jpg", windows98);
    // filesystem.symlink("/usr/system/wallpapers/windows-98.jpg", "/usr/system/wallpaper");
}
