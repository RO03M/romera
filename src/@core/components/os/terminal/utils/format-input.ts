export function formatInput(input: string) {
    const [program, ...args] = input.split(" ");

    return {
        program,
        args
    };
}