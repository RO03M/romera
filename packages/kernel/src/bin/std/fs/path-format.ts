export async function format(root: string, base: string): Promise<string> {
    return await syscall("pathFormat", root, base);
}