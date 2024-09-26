import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useProcessesStore } from "./use-processes-store";
import { useFilesystem } from "../filesystem/use-filesystem";
import { formatInput } from "../components/os/terminal/utils/format-input";
import type { Process } from "./types";

export function ProcessesHeart() {
	const { fsMethods, findNode } = useFilesystem();
	const { processes, setPidsToRunning, createProcess, killProcesses } = useProcessesStore();

	const processesMethods = useMemo(() => ({
		createProcess
	}), [createProcess]);

	const std = useMemo(
		() => ({
			fs: fsMethods,
			processes: processesMethods
		}),
		[fsMethods, processesMethods]
	);

	const heartbeat = useCallback(() => {
		const startedPids: Process["pid"][] = [];
        const pidsToKill: Process["pid"][] = [];
		const runningProcesses = processes.filter(
			(process) => process.status === "created"
		);

		for (const process of runningProcesses) {
			const { program, args } = formatInput(process.cmd);
			const functionFile = findNode(`/bin/${program}`);

			if (!functionFile) {
                pidsToKill.push(process.pid);
                process.ttyContext.free();
				continue;
			}
            
            // remover a verificação da string
            if (typeof functionFile.content !== "string") {
                continue;
            }

			const invoke = new Function("std", "context", functionFile.content ?? "");

			const output = invoke(std, {
				args,
				tty: process.ttyContext
			});

			startedPids.push(process.pid);
            Promise.resolve(output).then(() => {
                process.ttyContext.free();
                killProcesses([process.pid]);
            });
		}

        if (startedPids.length > 0) {
            setPidsToRunning(startedPids);
        }

        if (pidsToKill.length > 0) {
            killProcesses(pidsToKill);
        }
	}, [processes, std, killProcesses, findNode, setPidsToRunning]);

	useEffect(() => {
		const interval = setInterval(heartbeat, 100);

		return () => {
			clearInterval(interval);
		};
	}, [heartbeat]);

	return null;
}
