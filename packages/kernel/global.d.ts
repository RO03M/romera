import { Filesystem } from "@romos/fs";

declare global {
    function syscall<T = unknown>(method: string, ...args: any): T | Promise<T>;
    function exit(code?: number, message?: string): never;
    var filesystem: Filesystem;
    var proc: {
        pid: number;
        ppid: number;
        tty: number;
    }
}

export {};
