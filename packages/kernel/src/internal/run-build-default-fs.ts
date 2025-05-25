import { Filesystem, MemoryBackend } from "@romos/fs";
import { Kernel } from "../kernel";
import { buildFs } from "./build-default-fs";
import { writeFileSync } from "node:fs";

Kernel.instance().filesystem = new Filesystem("mock", { backend: new MemoryBackend() });

await buildFs();
Kernel.instance().filesystem.getJSON().then((json) => {
    writeFileSync("../gui/public/filesystem/default.json", JSON.stringify(json));
    process.exit();
});
