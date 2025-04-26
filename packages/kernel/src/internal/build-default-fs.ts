import { writeFileSync } from "node:fs";
import { Kernel } from "../kernel";
import { Filesystem, MemoryBackend } from "@romos/fs";
import { cat, ls, sleep, mkdir, watch } from "../bin/programs";

function buildFs() {
    Kernel.instance().filesystem.mkdir("/bin");
    Kernel.instance().filesystem.mkdir("/home");
    Kernel.instance().filesystem.mkdir("/home/romera");
    Kernel.instance().filesystem.mkdir("/home/romera/desktop");
    Kernel.instance().filesystem.mkdir("/home/romera/desktop/Projetos");
    Kernel.instance().filesystem.mkdir("/usr");
    Kernel.instance().filesystem.mkdir("/usr/applications");
    console.log(cat.toString());
    Kernel.instance().filesystem.writeFile("/bin/ls", ls.toString());
    Kernel.instance().filesystem.writeFile("/bin/cat", cat.toString());
    Kernel.instance().filesystem.writeFile("/bin/mkdir", mkdir.toString());
    Kernel.instance().filesystem.writeFile("/bin/sleep", sleep.toString());
    Kernel.instance().filesystem.writeFile("/bin/watch", watch.toString());

    Kernel.instance().filesystem.writeFile("/usr/applications/Sobre mim", "[Desktop Entry];\nx=0;\ny=0;\ndefaultExecName=monaco");
    Kernel.instance().filesystem.writeFile("/usr/applications/Projetos", "[Desktop Entry];\nx=0;\ny=1;");

    Kernel.instance().filesystem.writeFile("/home/romera/desktop/Sobre mim", `Olá, me chamo Romera!

Sou um desenvolvedor de software que começou a estudar sobre computação em 2016

Gosto de resolver problemas e de entender a fundo as soluções para os mesmos, além de sempre tentar buscar a melhor solução para o momento.

Desde o ínicio da minha carreira sempre consegui entender e aprender rapidamente, além de me dispor a ajudar a minha equipe.

No quesito de tecnologia eu já passei por várias, mas as que eu mais possuo experiência são Typescript/React/NextJs, PHP/Laravel, Rust, Java/Spring Boot e diversas outras mais ligadas ao cenário da web. Mas estou disposto a aprender qualquer ferramenta necessária para o meu desenvolvimento e o da minha equipe.`);
}

Kernel.instance().filesystem = new Filesystem("mock", { backend: new MemoryBackend() });

buildFs();
Kernel.instance().filesystem.getJSON().then((json) => {
    writeFileSync("../gui/public/filesystem/default.json", JSON.stringify(json));
    process.exit();
});
