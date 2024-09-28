import { useCallback, useEffect, useMemo } from "preact/hooks";
import { useProcessesStore } from "./use-processes-store";
import { useFilesystem } from "../filesystem/use-filesystem";
import { formatInput } from "../components/os/terminal/utils/format-input";
import type { Process } from "./types";

type Foo<T> = Record<string, Record<string, T | (() => void)> | (() => void)>;

export function ProcessesHeart() {
	const { fsMethods, findNode } = useFilesystem();
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

			const blobURL = URL.createObjectURL(
				new Blob(
					[
						"(",
						(() => {
							self.onmessage = ({ data }) => {
								console.log("data from main thread: ", data);
							};

							setTimeout(() => {
								self.postMessage(["std.fs.createFile", "/", "workerfile"]);
								// self.postMessage([
								// 	"processes.createWindowProcessFromProgramTable",
								// 	"terminal",
								// 	"/"
								// ]);
								self.close();
							}, 5000);
							console.log("Works!");
						}).toString(),
						")()"
					],
					{ type: "application/javascript" }
				)
			);

			const worker = new Worker(blobURL, {
				name: `process-pid-${process.pid}`
			});

			worker.onmessage = ({ data }) => {
				const [method, ...args] = data;
				if (typeof method !== "string") {
					return;
				}

				const paramPath = method.split(".");

				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				let last: any = { std, process };

				for (let i = 0; i < paramPath.length; i++) {
					if (!(paramPath[i] in last)) {
						console.log("Não achei");
						break;
					}

					last = last[paramPath[i]];
				}

				if (last !== undefined && typeof last === "function") {
					last(...args);
				}
			};

			const invoke = new Function("std", "context", functionFile.content ?? "");

			const output = invoke(std, {
				args,
				tty: process.ttyContext
			});

			startedPids.push(process.pid);
			Promise.resolve(output).then(() => {
				process?.ttyContext?.free();
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
