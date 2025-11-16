import { useEffect, useState } from "preact/hooks";
import { DockItem } from "./dock-item";
import styles from "./dock.module.css";
import { Kernel, Process } from "@romos/kernel";

export function Dock() {
    const [processes, setProcesses] = useState<Process[]>([]);

    useEffect(() => {
        Kernel.instance().scheduler.watch("all", ["ran", "killed"], () => {
            const componentProcesses: Process[] = [];
            for (const [_key, process] of Kernel.instance().scheduler.processes) {
                if (process.command === "component") {
                    componentProcesses.push(process);
                }
            }

            setProcesses(componentProcesses);
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.bar}>
                {processes.map((process) => {
                    const isDir = process.args?.[0] === "explorer"; // Se for o app explorer eu mostro o icone de diretório
                    return (
                        <DockItem
                            pid={process.pid}
                            type={isDir ? "dir" : "file"}
                            name={process.cwd}
                            showName={false}
                        />
                    )
                })}
            </div>
        </div>
    )
}