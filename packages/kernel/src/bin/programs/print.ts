async function main(message: string) {
    os.stdout.write(message);
}

export const print = main;