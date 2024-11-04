import { expect, it } from "vitest";
import { IDB } from "./idb";

import indexeddb from "fake-indexeddb";

globalThis.indexedDB = indexeddb;

it("Should be able to add a node", async () => {
    const idb = new IDB();
    await idb.open();
    const data = new Uint8Array([1, 2, 3, 4]);
    idb.add(1, data);
    expect(await idb.get(1)).toEqual(data);
});