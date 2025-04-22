const responsesFromMainThread = {};
let canvas = null;
let context = null;

self.onmessage = ({ data }) => {
    if (data.type === "SYSCALL_RESPONSE" && data.id !== undefined) {
        responsesFromMainThread[data.id] = {
            message: data.response,
            status: data.status
        };
    }

    if (data.canvas) {
        canvas = data.canvas;
        // context = canvas.getContext("2d");
        // context.fillStyle = "#1ff";
        // context.fillRect(0, 0, canvas.width, canvas.height);
    }
};

// Tem uma forma bem melhor de fazer isso
// Ao invés de fazer um loop é só guardar a referência do resolve em um map e boas
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