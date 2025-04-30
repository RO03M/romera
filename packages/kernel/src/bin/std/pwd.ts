export async function pwd(): Promise<string> {
    return await syscall("pwd", proc.pid);
}