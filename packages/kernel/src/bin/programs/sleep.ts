async function main(seconds: number) {
    os.stdin.on("data", (data) => {
        console.log("data from pipe", data);
    });

    return new Promise<void>((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

export const sleep = main;