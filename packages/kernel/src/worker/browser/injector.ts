import { buildStd } from "../../bin/std/build-std";
import type { Process } from "../../process/process";
import { Stream } from "../../stream/stream";
import { buildSyscall } from "../syscall";

export enum CompileTarget {
	NodeJS,
	Browser
}

export function compile(process: Process, main: string, target: CompileTarget) {
	const code = `
${Stream.toString()}
${buildStd()}
${buildSyscall(target === CompileTarget.NodeJS ? "node" : "browser")}

const os = {
	stdin: new Stream(),
	stdout: new Stream()
};

os.stdin.on("data", (data) => {
	self.postMessage({
		opcode: "stdin",
		content: data
	});
});

os.stdout.on("data", (data) => {
	self.postMessage({
		opcode: "stdout",
		content: data
	});
});

function exit(code = 0, message = "") {
    self.postMessage({ code, message, kill: true });
}

const args = [${process.args.map((arg) => `"${arg}"`)}];

const proc = {
    pid: ${process.pid},
    ppid: ${process.ppid},
    tty: ${process.tty}
};

${main.trim()}

const stdout = await main(...args);

exit(0, stdout);
`;

	return code.trim();
}

export function injectScript(content: string, process: Process) {
	const workerCode = `
		(async () => {
			${compile(process, content, CompileTarget.Browser)}
		})();
	`;

	return URL.createObjectURL(
		new Blob([workerCode], { type: "application/javascript" })
	)
}
