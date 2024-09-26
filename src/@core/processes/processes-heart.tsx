import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useProcessesStore } from "./use-processes-store";
import { useFilesystem } from "../filesystem/use-filesystem";
import { formatInput } from "../components/os/terminal/utils/format-input";
import type { Process } from "./types";

export function ProcessesHeart() {
	const { fsMethods, findNode } = useFilesystem();
	const { processes, setPidsToRunning } = useProcessesStore();

	const std = useMemo(
		() => ({
			fs: fsMethods
		}),
		[fsMethods]
	);

	// adicionar um temporizador no use effect
	// o temporizador seria o "heartbeat" dos processos
	// a cada x segundos, varrer os processos e fazer algo
	// tentar usar promises para rodar em paralelo

	const heartbeat = useCallback(() => {
		const startedPids: Process["pid"][] = [];
		const runningProcesses = processes.filter(
			(process) => process.status === "created"
		);
		for (const process of runningProcesses) {
			const { program, args } = formatInput(process.cmd);
			const functionFile = findNode(`/bin/${program}`);

			// remover a verificação da string
			console.log(functionFile);
			if (!functionFile || typeof functionFile.content !== "string") {
				continue;
			}

			const invoke = new Function("std", "context", functionFile.content ?? "");

			const output = invoke(std, {
				args,
				tty: process.ttyContext
			});

			startedPids.push(process.pid);
            const promise = Promise.resolve(output).then((output) => {
                process.ttyContext.restingMode();
                console.log("result from promise: ", output);
            });

            Promise.reject(promise);
		}

        if (startedPids.length > 0) {
            console.log(startedPids);
        }
		setPidsToRunning(startedPids);
	}, [processes, std, findNode, setPidsToRunning]);

	useEffect(() => {
		const interval = setInterval(heartbeat, 500);

		return () => {
			clearInterval(interval);
		};
	}, [heartbeat]);

	return null;
}
