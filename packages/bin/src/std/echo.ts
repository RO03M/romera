export async function echo(message: unknown) {
    await syscall("echo", message, proc.tty);
}