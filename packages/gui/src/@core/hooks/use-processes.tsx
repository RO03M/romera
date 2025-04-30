import { Kernel, type Process } from "@romos/kernel";
import { useEffect, useState } from "preact/hooks";

export function useProcesses() {
    const [processes, setProcesses] = useState<Process[]>([]);

    useEffect(() => {
        Kernel.instance().scheduler.watch("all", ["created", "slept", "ran", "killed"], () => {
            setProcesses([...Kernel.instance().scheduler.processes.values()]);
        });
    }, []);

    return processes;
}