importScripts(`${self.location.origin}/sys/syscall.js`);

async function sleep(millis = 1000) {
    return new Promise((res) => {
        setTimeout(res, millis);
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

// self.addEventListener("message", (data) => {
//     console.log("event listener", data);
// });

async function makeWindow(pid) {
    await fork("component", ["canvas", "title", "/home", pid], pid)

    return new Promise((resolve) => {
        let tries = 0;
        const checkCanvasInterval = setInterval(() => {
            tries++;
            if (tries >= 20000) {
                clearInterval(checkCanvasInterval);
                resolve(null);
            }
    
            if (canvas !== null) {
                clearInterval(checkCanvasInterval);
                resolve(canvas);
            }
        }, 10);
    });
}