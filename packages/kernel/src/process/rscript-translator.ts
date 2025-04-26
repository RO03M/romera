import type { Process } from "./process";

export class RScriptTranslator {
	public rawScript = "";
	public cookedScript = "";

	private readonly process: Process;

	constructor(rawScript: string, process: Process) {
		this.rawScript = rawScript;
		this.process = process;
	}

	public generateBlob() {
		return URL.createObjectURL(
			new Blob([this.cookedScript], { type: "application/javascript" })
		);
	}

	public cookScript() {
		this.cookedScript = `
((async () => {
    const PID = ${this.process.pid};
	const proc = {
		pid: ${this.process.pid},
		ppid: ${this.process.ppid},
		tty: ${this.process.tty}
	};
    importScripts("${location.origin}/sys/std.js", "${location.origin}/sys/processes.js");

    ${this.rawScript}

    const stdout = await main(${this.process.args.map((arg) => `'${arg}'`)}); // declared in the rawScript

    // forced exit
    exit(0, stdout);
}))()
        `;
	}
}
