import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useProcessesStore } from "./use-processes-store";
import { formatInput } from "../components/os/terminal/utils/format-input";
import type { Process } from "./types";
import { RScriptTranslator } from "./rscript-translator";
import { format, normalize } from "../filesystem/utils/path";
import { filesystem } from "../../app";
import type { ReadFileOptions } from "../filesystem/types";

export function ProcessesHeart() {
	const {
		processes,
		setPidsToRunning,
		createProcess,
		createWindowProcessFromProgramTable,
		killProcesses
	} = useProcessesStore();

	const syscallMethods = useMemo(
		() => ({
			stat: (filepath: string) => filesystem.stat(filepath),
			lstat: (filepath: string) => filesystem.lstat(filepath),
			readdir: (filepath: string) => filesystem.readdir(filepath),
			readFile: (filepath: string, options?: ReadFileOptions) =>
				filesystem.readFile(filepath, options),
			fs_normalized: normalize,
			create_proc_default_rgui: createWindowProcessFromProgramTable,
			exec: createProcess,
			mkdir: (filepath: string) => filesystem.mkdir(filepath),
			pathFormat: (root: string, base: string) => format({ root, base })
		}),
		[createProcess, createWindowProcessFromProgramTable]
	);

	const heartbeat = useCallback(() => {
		const startedPids: Process["pid"][] = [];
		const pidsToKill: Process["pid"][] = [];
		const runningProcesses = processes.filter(
			(process) => process.status === "created"
		);

		for (const process of runningProcesses) {
			if (process.Component !== undefined) {
				continue;
			}

			const { program, args } = formatInput(process?.cmd ?? "");

			const programContent = filesystem.readFile(`/bin/${program}`, {
				decode: true
			});

			if (!programContent) {
				pidsToKill.push(process.pid);
				process?.ttyContext?.free();
				continue;
			}

			// remover a verificação da string
			if (typeof programContent !== "string") {
				continue;
			}

			startedPids.push(process.pid);

			const translator = new RScriptTranslator(programContent, args);
			translator.cookScript();
			const scriptBlobURL = translator.generateBlob();

			const worker = new Worker(scriptBlobURL, {
				name: `process-pid-${process.pid}`
			});

			worker.onerror = () => {
				killProcesses([process.pid]);
				process?.ttyContext?.free();
			};

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

							const methods: Record<
								string,
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								((...args: any[]) => unknown) | undefined
							> = {
								...syscallMethods,
								echo: process.ttyContext?.echo,
								pwd: () => process.ttyContext?.workingDirectory
							};

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
									try {
										const syscallResponse = methods[method](...args);

										const treatedResponse =
											syscallResponse === undefined
												? ""
												: JSON.parse(JSON.stringify(syscallResponse));

										worker.postMessage({
											type: "SYSCALL_RESPONSE",
											id: responseId,
											response: treatedResponse,
											status: 1
										});
									} catch (error) {
										worker.postMessage({
											type: "SYSCALL_RESPONSE",
											id: responseId,
											response: error,
											status: 0
										});
									}
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
	}, [processes, syscallMethods, killProcesses, setPidsToRunning]);

	useEffect(() => {
		const interval = setInterval(heartbeat, 100);

		return () => {
			clearInterval(interval);
		};
	}, [heartbeat]);

	return null;
}
