import { print } from "../programs/print";
import { echo } from "./echo";
import { readFile, writeFile, stat } from "./fs/fs";
import { format } from "./fs/path-format";
import { pwd } from "./pwd";

export function buildStd() {
    return [
        echo.toString(),
        pwd.toString(),
        format.toString(),
        writeFile.toString(),
        readFile.toString(),
        stat.toString(),
        print.toString()
    ].join("\n");
}