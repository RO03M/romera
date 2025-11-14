import { code } from "../programs";
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
        stat.toString()
    ].join("\n");
}