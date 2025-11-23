import { Filesystem, ReadFileOptions } from "@romos/fs";
import { Stream } from "./src/stream/stream";

declare global {
    function syscall<T = unknown>(method: string, ...args: any): T | Promise<T>;
    function exit(code?: number, message?: string): never;
    // function echo(message: number | string | boolean): void;
    function pwd(): Promise<string>;
    function format(root: string, base: string): Promise<string>;
    function writeFile(filepath: string, content: string | Uint8Array): Promise<void>;
    function readFile(filepath: string, options: ReadFileOptions): Promise<string | Uint8Array | null>;
    function stat(filepath: string): Promise<Stat | null>;
    function print(message: string): void;
    var filesystem: Filesystem;
    var proc: {
        pid: number;
        ppid: number;
        tty: number;
    };
    var os: {
        stdin: Stream;
        stdout: Stream;
    };
}

export {};
