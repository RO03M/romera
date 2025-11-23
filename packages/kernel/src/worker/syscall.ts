// import { parentPort } from "node:worker_threads";

// async function getSelf() {
//     if (typeof window === "undefined") {
//         const { parentPort } = await import("node:worker_threads");

//         return parentPort;
//     }
// }

// const self = getSelf();

const queue = new Map<string, (value: unknown) => void>();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function syscall(method: string, ...args: any[]) {
    const syscallId = (Math.random() + 1).toString(36).substring(7);
    self.postMessage({
        type: "SYSCALL",
        method,
        args,
        syscallId
    });

    const promise = new Promise((resolve) => {
        queue.set(syscallId, resolve)
    });

    return promise;
}

function messageHandler() {
    return `
        if (data.type === "SYSCALL_RESPONSE" && data.id !== undefined) {
            const resolve = queue.get(data.id);
            if (!resolve || typeof resolve !== "function") {
                return;
            }
            
            resolve(data.response);
        } else if (data.type === "stdin") {
            os.stdin.write(data.value)
        } else if (data.type === "stdout") {
            os.stdout.write(data.value);
        }
    `;
}

function nodeSyscall() {
    return `
        self.on("message", (data) => {
            if (data.type === "SYSCALL_RESPONSE" && data.id !== undefined) {
                const resolve = queue.get(data.id);
                if (!resolve || typeof resolve !== "function") {
                    return;
                }
                
                resolve(data.response);
            } else if (data.type === "stdin") {
                os.stdin.write(data.value)
            } else if (data.type === "stdout") {
                os.stdout.write(data.value);
            }
        });
    `;
}

function browserSyscall() {
    return `
        self.onmessage = (({ data }) => {
            if (data.type === "SYSCALL_RESPONSE" && data.id !== undefined) {
                const resolve = queue.get(data.id);
                if (!resolve || typeof resolve !== "function") {
                    return;
                }
                
                resolve(data.response);
            } else if (data.type === "stdin") {
                os.stdin.write(data.value)
            } else if (data.type === "stdout") {
                os.stdout.write(data.value);
            }
        });
    `;
}

export function buildSyscall(node: "browser" | "node") {
    return `
        const queue = new Map();

        ${node === "node" ? nodeSyscall() : browserSyscall()}

        ${syscall.toString().replace("syscall$1", "syscall")}
    `;
}