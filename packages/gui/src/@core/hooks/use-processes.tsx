import { Kernel, type Process } from "@romos/kernel";
import { useEffect, useState } from "preact/hooks";

export function useProcesses() {
    const [processes, setProcesses] = useState<Process[]>([]);

    useEffect(() => {
        Kernel.instance().scheduler.watch("all", ["ran", "killed"], () => {
            console.log("teste");
            const componentProcesses = Kernel.instance().scheduler.processes.filter(
                (process) => process.command === "component"
            );
            setProcesses(componentProcesses);
        });
    }, []);

    return processes;
}