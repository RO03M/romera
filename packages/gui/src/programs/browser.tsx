import { useEffect, useState } from "preact/hooks";
import type { ProcessComponentProps } from "./types";
import { Kernel } from "@romos/kernel";
import { BlobManager } from "../blob-manager";
import { MIMEMAP } from "../mimemap";
import { forwardRef } from "preact/compat";

async function parseOsImports(content: string) {
    const osImportRegex = /os_import\(['"]([^'"]+)['"]\)/g;

    const pathBlobMap = new Map<string, string>();

    const paths = content.matchAll(osImportRegex);

    for await (const [_, path] of paths) {
        const blob = await BlobManager.instance().get(path);

        // if (blob === null) {
        //     throw new ENOENT(path);
        // }

        pathBlobMap.set(path, blob ?? "");
    }

    const replaced = content.replace(osImportRegex, (_, path) => {
        return pathBlobMap.get(path) ?? "";
    });

    return replaced;
}

export const BrowserProgram = forwardRef<HTMLIFrameElement, ProcessComponentProps>(
    function BrowserProgram(props, ref) {
        const [content, setContent] = useState("");
        useEffect(() => {

            async function loadFile() {
                if (!props.workingDirectory) {
                    return;
                }

                const file = await Kernel.instance().filesystem.readFile(props.workingDirectory, { decode: true });
                const fileWithImports = await parseOsImports(file!);
                const blob = new Blob([fileWithImports], {
                    type: MIMEMAP.get(".html")
                });
                const blobUrl = URL.createObjectURL(blob);

                // const blobUrl = await BlobManager.instance().get(props.workingDirectory);

                if (!blobUrl) {
                    return;
                }

                setContent(blobUrl);
            }

            loadFile();

        }, [props.workingDirectory]);

        return (
            <iframe
                ref={ref}
                tabIndex={1}
                sandbox={"allow-scripts allow-same-origin allow-pointer-lock"}
                src={content}
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />
        );
    }
);