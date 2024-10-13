export class RScriptTranslator {
    public args: string[];
	public rawScript = "";
	public cookedScript = "";

	constructor(rawScript: string, args: string[] = []) {
		this.rawScript = rawScript;
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
    const responsesFromMainThread = {};

    self.onmessage = ({ data }) => {
        if (data.type === "SYSCALL_RESPONSE" && data.id !== undefined) {
            responsesFromMainThread[data.id] = {
                message: data.response,
                status: data.status
            };
        }
    };

    async function sleep(millis = 1000) {
        return new Promise((res) => {
            setTimeout(res, millis);
        });
    }

    async function syscall(method, ...args) {
        const id = (Math.random() + 1).toString(36).substring(7);
        self.postMessage({
            type: "SYSCALL",
            method,
            args: args,
            responseId: id
        });

        return new Promise((resolve, reject) => {
            let tries = 0;
            const checkResponseInterval = setInterval(() => {
                tries++;
                if (id in responsesFromMainThread) {
                    clearInterval(checkResponseInterval);
                    if (responsesFromMainThread[id].status == 1) {
                        resolve(responsesFromMainThread[id].message);
                    } else {
                        reject(responsesFromMainThread[id].message);
                    }
                    delete responsesFromMainThread[id];
                }
            }, 10);
        });
    }

    async function echo(message) {
        return await syscall("echo", message);
    }
    
    async function pwd() {
        return await syscall("pwd");
    }

    async function pathFormat(root, base) {
        return await syscall("pathFormat", root, base);
    }

    async function normalize(filepath) {
        return await syscall("normalize", filepath);
    }

    async function mkdir(path) {
        return await syscall("mkdir", path);
    }

    const processes = {
        fork: async function(command, args = []) {
            return await syscall("createProcess", command, args);
        }
    };

    const fs = {
        stat: async function(filepath) {
            return await syscall("stat", filepath);
        },
        writeFile: async function(path, content) {
            return await syscall("writeFile", path, content);
        },
        readFile: async function(filepath, decode = true) {
            return await syscall("readFile", filepath, { decode });
        }
    };

    function exit(code = 0, message = "") {
        self.postMessage({ code, message, kill: true });
    }

    ${this.rawScript}

    const stdout = await main(${this.args.map((arg) => `'${arg}'`)}); // declared in the rawScript

    // forced exit
    exit(0, stdout);
}))()
        `;
	}
}
