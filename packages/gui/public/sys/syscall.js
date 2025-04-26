const responsesFromMainThread = {};
let canvas = null;
let context = null;

// self.onmessage = ({ data }) => {
//     if (data.type === "SYSCALL_RESPONSE" && data.id !== undefined) {
//         responsesFromMainThread[data.id] = {
//             message: data.response,
//             status: data.status
//         };
//     }

//     if (data.canvas) {
//         canvas = data.canvas;
//         // context = canvas.getContext("2d");
//         // context.fillStyle = "#1ff";
//         // context.fillRect(0, 0, canvas.width, canvas.height);
//     }
// };
const queue = new Map();

self.onmessage = (({ data }) => {
    if (data.type === "SYSCALL_RESPONSE" && data.id !== undefined) {
        const resolve = queue.get(data.id);
        if (!resolve || typeof resolve !== "function") {
            return;
        }
        
        resolve(data.response);
    }
})

// Tem uma forma bem melhor de fazer isso
// Ao invés de fazer um loop é só guardar a referência do resolve em um map e boas
async function syscall(method, ...args) {
    console.log("syscall", method);
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