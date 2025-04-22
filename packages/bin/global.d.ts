import { Filesystem } from "@romos/fs";

declare global {
    function syscall(method: string, ...args: any): unknown;
    function exit(code?: number, message?: string): never;
    var filesystem: Filesystem;
}

export {};
