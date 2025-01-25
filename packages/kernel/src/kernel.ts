import { Filesystem } from "@romos/fs";
import { TTYManager } from "./tty-manager";
import { Scheduler } from "./process/scheduler";

export class Kernel {
    public filesystem: Filesystem;
    public scheduler: Scheduler;
    public ttyManager: TTYManager;

    private static _instance: Kernel;

    constructor() {
        this.filesystem = new Filesystem("rome-os-fs");
        this.filesystem.init();

        this.scheduler = new Scheduler({
            concurrency: 4 // TODO add dynamic concurrency limit
        });

        setInterval(() => {
            this.scheduler.tick().next();
        }, 0);

        this.ttyManager = new TTYManager();
    }

    public static instance() {
        if (Kernel._instance === undefined) {
            Kernel._instance = new Kernel();
        }
        
        return Kernel._instance
    }

    /**
     * TODO
     * Implementar as syscalls no kernel, já que aqui é onde eu faria a interface com o resto
     * Para executar a syscall lá do processo, posso usar um callback e boas?
     */
}