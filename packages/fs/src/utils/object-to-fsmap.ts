import { FSMap } from "../filesystem";
import { Stat } from "../stat";

type FSObjectStat = { type: Stat["type"], inode: number, size: number, target: Stat["target"] };

interface FSObject {
    "0": FSObjectStat;
    [name: string]: FSObjectStat | FSObject;
}

export function objectToFsMap(data: FSObject): FSMap {
    if (typeof data !== "object") {
        return new Map();
    }

    const map: FSMap = new Map();
    for (const [key, value] of Object.entries(data)) {
        if (key === "0") {
            const statObject = value as FSObjectStat;

            const stat = new Stat(statObject.type, statObject.inode, statObject.size, statObject.target);

            map.set(0, stat);
            continue;
        }

        const fsObject = value as FSObject;
        const children = objectToFsMap(fsObject);

        map.set(key, children);
    }

    return map;
}