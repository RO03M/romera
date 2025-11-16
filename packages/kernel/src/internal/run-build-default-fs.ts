import { Filesystem, MemoryBackend } from "@romos/fs";
import { Kernel } from "../kernel";
import { buildFs } from "./build-default-fs";
import { writeFileSync } from "node:fs";

Kernel.instance().filesystem = new Filesystem("mock", { backend: new MemoryBackend() });

await buildFs();



Kernel.instance().filesystem.export()
    .then(async (bin) => {
        const cs = new CompressionStream("deflate");
        const writer = cs.writable.getWriter();
        writer.write(bin);
        writer.close();

        const compressed = await new Response(cs.readable).arrayBuffer();

        writeFileSync("../gui/public/filesystem/fsbin", new Uint8Array(compressed));
    })
    .catch(console.log)
    .finally(() => process.exit());
