import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useProcessesStore } from "./use-processes-store";
import { useFilesystem } from "../filesystem/use-filesystem";
import { formatInput } from "../components/os/terminal/utils/format-input";
import type { Process } from "./types";
import { RScriptTranslator } from "./rscript-translator";
import { normalize } from "../filesystem/utils/path";

export function ProcessesHeart() {
	const { fsMethods, findNode, findFile, findDirectory } = useFilesystem();
	const {
		processes,
		setPidsToRunning,
		createProcess,
		createWindowProcessFromProgramTable,
		killProcesses
	} = useProcessesStore();

	const processesMethods = useMemo(
		() => ({
			createProcess,
			killProcesses,
			createWindowProcessFromProgramTable
		}),
		[createProcess, killProcesses, createWindowProcessFromProgramTable]
	);

	const syscallMethods = useMemo(
		() => ({
			fs_ffile: findFile,
			fs_fdir: findDirectory,
			fs_normalized: normalize
		}),
		[findFile, findDirectory]
	);

	const heartbeat = useCallback(() => {
		const startedPids: Process["pid"][] = [];
		const pidsToKill: Process["pid"][] = [];
		const runningProcesses = processes.filter(
			(process) => process.status === "created"
		);

		for (const process of runningProcesses) {
			const { program, args } = formatInput(process?.cmd ?? "");
			const functionFile = findNode(`/bin/${program}`);

			if (!functionFile) {
				pidsToKill.push(process.pid);
				process?.ttyContext?.free();
				continue;
			}

			// remover a verificação da string
			if (typeof functionFile.content !== "string") {
				continue;
			}

			startedPids.push(process.pid);

			const translator = new RScriptTranslator(functionFile.content, args);
			translator.cookScript();
			const scriptBlobURL = translator.generateBlob();

			const worker = new Worker(scriptBlobURL, {
				name: `process-pid-${process.pid}`
			});

			worker.onerror = () => {
				killProcesses([process.pid]);
				process?.ttyContext?.free();
			}

			worker.onmessage = ({ data }) => {
				if (data === 0) {
					killProcesses([process.pid]);
					process?.ttyContext?.free();
					worker.terminate();
					return;
				}

				if (data.type !== undefined) {
					switch (data.type) {
						case "SYSCALL": {
							const { method, args, responseId } = data;
							if (typeof method !== "string") {
								return;
							}

							const methods: Record<string, ((...args: string[]) => unknown) | undefined> = {
								...syscallMethods,
								echo: process.ttyContext?.echo,
								pwd: () => process.ttyContext?.workingDirectory
							}

							if (method in methods) {
								if (
									methods[method] === undefined ||
									typeof methods[method] !== "function"
								) {
									worker.postMessage({
										type: "SYSCALL_RESPONSE",
										id: responseId,
										response: "SYSCALL_METHOD_NOT_READY"
									});
								} else {
									const syscallResponse = methods[method](...args);

									worker.postMessage({
										type: "SYSCALL_RESPONSE",
										id: responseId,
										response: syscallResponse
									});
								}
							} else {
								worker.postMessage({
									type: "SYSCALL_RESPONSE",
									id: responseId,
									response: "SYSCALL_NOT_FOUND"
								});
							}

							return;
						}
					}
				}
			};
		}

		if (startedPids.length > 0) {
			setPidsToRunning(startedPids);
		}

		if (pidsToKill.length > 0) {
			killProcesses(pidsToKill);
		}
	}, [processes, syscallMethods, killProcesses, findNode, setPidsToRunning]);

	useEffect(() => {
		const interval = setInterval(heartbeat, 100);

		return () => {
			clearInterval(interval);
		};
	}, [heartbeat]);

	return null;
}
