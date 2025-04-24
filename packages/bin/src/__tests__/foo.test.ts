import { describe, it, test } from "vitest";
import { ls } from "../programs/ls";
import { cat } from "../programs/cat";
import { Kernel, waitpid, type Process } from "@romos/kernel";
import { mkdir } from "../programs/mkdir";
import { sleep } from "../programs/sleep";
import { watch } from "../programs/watch";

describe("foo", () => {
	Kernel.instance().filesystem.mkdir("/bin");
	Kernel.instance().filesystem.writeFile("/bin/ls", ls.toString());
	Kernel.instance().filesystem.writeFile("/bin/cat", cat.toString());
	Kernel.instance().filesystem.writeFile("/bin/mkdir", mkdir.toString());
	Kernel.instance().filesystem.writeFile("/bin/sleep", sleep.toString());
	Kernel.instance().filesystem.writeFile("/bin/watch", watch.toString());

	test("ls", async () => {
		await Kernel.instance().syscall("fork", "ls");
	});

	test("cat", async () => {
		await Kernel.instance().syscall("fork", "cat", ["./bin/cat"]);
	});

	test("mkdir", async () => {
		await Kernel.instance().syscall("fork", "mkdir", ["./teste"]);
		await Kernel.instance().syscall("fork", "ls");
	});


	test("sleep", async () => {
		const child: Process = await Kernel.instance().syscall("fork", "sleep", [1]);
		await waitpid(child.pid);
	});
});
