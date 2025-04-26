import { echo } from "./echo";
import { pwd } from "./pwd";

export function buildStd() {
    return [
        echo.toString(),
        pwd.toString()
    ].join("\n");
}