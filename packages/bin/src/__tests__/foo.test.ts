import { describe, it, test } from "vitest";
import { ls } from "../programs/ls";
import { cat } from "../programs/cat";

describe("foo", () => {
    it("Should be able to call the syscall from the kernel", async () => {
        await syscall("mkdir", "/teste");
        await syscall("mkdir", "/teste2");
        await syscall("mkdir", "/teste3");
        await syscall("mkdir", "/teste4");
        
        ls();
    });

    test("cat", async () => {
        await syscall("writeFile", "/file.teste", "Teste de cat");
        ls()
        cat("/file.teste")
    });
});