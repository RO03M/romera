export class RScriptTranslator {
    public args: string[];
	public rawScript = "";
	public cookedScript = "";
    public pid: number;

	constructor(rawScript: string, pid: number, args: string[] = []) {
		this.rawScript = rawScript;
        this.pid = pid;
        this.args = args;
	}

	public generateBlob() {
		return URL.createObjectURL(
			new Blob([this.cookedScript], { type: "application/javascript" })
		);
	}

	public cookScript() {
		this.cookedScript = `
((async () => {
    const PID = ${this.pid};
    importScripts("${location.origin}/sys/std.js", "${location.origin}/sys/processes.js");

    ${this.rawScript}

    const stdout = await main(${this.args.map((arg) => `'${arg}'`)}); // declared in the rawScript

    // forced exit
    exit(0, stdout);
}))()
        `;
	}
}
