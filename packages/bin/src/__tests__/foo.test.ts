import "fake-indexeddb/auto";
import { describe, it } from "vitest";
import { ls } from "../ls";

describe("foo", () => {
    it("Should be able to call the syscall from the kernel", async () => {
        await syscall("mkdir", "/teste");
        await syscall("mkdir", "/teste2");
        await syscall("mkdir", "/teste3");
        await syscall("mkdir", "/teste4");
        const foo = await syscall("readdir", "/");
        ls()
        syscall("echo", "teste", -1)
        console.log(foo);
        // mkdir("/teste")
        // mkdir("/teste2")
        // mkdir("/teste2/teste")
        // console.log(readdir("/"));
        // console.log(readdir("/teste2"));
    });
});