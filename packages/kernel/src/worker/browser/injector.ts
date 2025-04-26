import { buildStd } from "../../bin/std/build-std";
import type { Process } from "../../process/process";
import { buildSyscall } from "../syscall";

export function injectScript(content: string, process: Process) {
	const workerCode = `
		(async () => {
			const args = [${process.args.map((arg) => `"${arg}"`)}];
	
			const proc = {
				pid: ${process.pid},
				ppid: ${process.ppid},
				tty: ${process.tty}
			};
	
			${buildStd()}
			${buildSyscall("browser")}
	
			${content}
	
			const stdout = await main(...args);
	
			exit(0, stdout);
		})();
	`;

	return URL.createObjectURL(
		new Blob([workerCode], { type: "application/javascript" })
	)
}

// export class Injector {
// 	public rawScript = "";
// 	public cookedScript = "";

// 	private readonly process: Process;

// 	constructor(rawScript: string, process: Process) {
// 		this.rawScript = rawScript;
// 		this.process = process;
// 	}

// 	public generateBlob() {
// 		return URL.createObjectURL(
// 			new Blob([this.cookedScript], { type: "application/javascript" })
// 		);
// 	}

// 	public cookScript() {
// 		this.cookedScript = `
// ((async () => {
//     const PID = ${this.process.pid};
// 	const proc = {
// 		pid: ${this.process.pid},
// 		ppid: ${this.process.ppid},
// 		tty: ${this.process.tty}
// 	};
//     importScripts("${location.origin}/sys/std.js", "${location.origin}/sys/processes.js");

//     ${this.rawScript}

//     const stdout = await main(${this.process.args.map((arg) => `'${arg}'`)}); // declared in the rawScript

//     // forced exit
//     exit(0, stdout);
// }))()
//         `;
// 	}
// }
