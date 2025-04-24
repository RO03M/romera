export async function pwd() {
    return await syscall("pwd", proc.tty);
}