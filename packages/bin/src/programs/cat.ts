async function main(filename: string) {
    const pwd = await syscall("pwd", -1);
    const filepath = await syscall("normalize", `${pwd}/${filename}`);

    const stat = await syscall("stat", filepath);

    if (stat !== null) {
        const content = await syscall("readFile", filepath, { decode: true });

        await syscall("echo", content, -1);
    }
}

export const cat = main;