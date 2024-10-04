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

    function exit(code = 0) {
        self.postMessage(code);
    }

    ${this.rawScript}

    await main(${this.args.map((arg) => `'${arg}'`)}); // declared in the rawScript
    
    // forced exit
    exit();
}))()
        `;
	}
}
