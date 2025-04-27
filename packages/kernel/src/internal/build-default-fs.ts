import { readFileSync, writeFileSync } from "node:fs";
import { Kernel } from "../kernel";
import { Filesystem, MemoryBackend } from "@romos/fs";
import { cat, ls, sleep, mkdir, watch } from "../bin/programs";
import { touch } from "../bin/programs/touch";
import { prog_pwd } from "../bin/programs/pwd";
import { addDoom } from "./desktop/doom";

async function buildFs() {
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

    filesystem.writeFile("/usr/applications/Sobre mim", "[Desktop Entry];\nx=0;\ny=0;\ndefaultExecName=monaco");
    filesystem.writeFile("/usr/applications/Projetos", "[Desktop Entry];\nx=0;\ny=1;");

    filesystem.mkdir("/home/romera/desktop/Projetos");
    filesystem.writeFile("/home/romera/desktop/Sobre mim", `Olá, me chamo Romera!

Sou um desenvolvedor de software que começou a estudar sobre computação em 2016

Gosto de resolver problemas e de entender a fundo as soluções para os mesmos, além de sempre tentar buscar a melhor solução para o momento.

Desde o ínicio da minha carreira sempre consegui entender e aprender rapidamente, além de me dispor a ajudar a minha equipe.

No quesito de tecnologia eu já passei por várias, mas as que eu mais possuo experiência são Typescript/React/NextJs, PHP/Laravel, Rust, Java/Spring Boot e diversas outras mais ligadas ao cenário da web. Mas estou disposto a aprender qualquer ferramenta necessária para o meu desenvolvimento e o da minha equipe.`);

    await addDoom();

    const ubuntu22 = readFileSync(`${__dirname}/wallpapers/ubuntu-22.jpg`);

    filesystem.mkdir("/usr/system");
    filesystem.mkdir("/usr/system/wallpapers");
    await filesystem.writeFile("/usr/system/wallpapers/ubuntu-22.jpg", ubuntu22);
    filesystem.symlink("/usr/system/wallpapers/ubuntu-22.jpg", "/usr/system/wallpaper");
}

Kernel.instance().filesystem = new Filesystem("mock", { backend: new MemoryBackend() });

await buildFs();
Kernel.instance().filesystem.getJSON().then((json) => {
    writeFileSync("../gui/public/filesystem/default.json", JSON.stringify(json));
    process.exit();
});
