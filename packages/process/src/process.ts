export class Process {
    public readonly pid: number;
    public readonly ppid: number | null;
    public readonly tty: string | null;
}