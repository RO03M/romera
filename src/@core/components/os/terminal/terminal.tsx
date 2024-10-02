import { styled } from "@mui/material";
import { TerminalInput } from "./input";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useFilesystem } from "../../../filesystem/use-filesystem";
import { formatInput } from "./utils/format-input";
import { normalize } from "../../../filesystem/utils/path";
import { type TerminalOutput, TerminalOutputList } from "./output-list";
import { useProcessesStore } from "../../../processes/use-processes-store";
import { incrementalId } from "../../../utils/incremental-id";
import type { ProcessComponentProps } from "../../../processes/types";
import { useTTYStore } from "../../../system/tty";

export function Terminal(props: ProcessComponentProps) {
	const { workingDirectory = "/" } = props;

	const { ttys, addTTY } = useTTYStore();

	const [id] = useState(incrementalId("tty"));
	// Rename to currentWorkingDirectory
	const [currentWorkingDirectory, setCurrentWorkingDirectory] =
		useState(workingDirectory);
	const [isPending, setIsPending] = useState(false);
	const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
	const [input, setInput] = useState("");

	const { findDirectory } = useFilesystem();
	const { createProcess } = useProcessesStore();

	const echo = useCallback((message: string) => {
		const output: TerminalOutput = {
			message
		};

		setOutputs((prevOutputs) => [...prevOutputs, output]);
	}, []);

	const pendingMode = useCallback(() => {
		setIsPending(true);
	}, []);

	const free = useCallback(() => {
		setIsPending(false);
	}, []);

	const cd = useCallback(
		(path: string) => {
			let absolutePath = "";
			// find from root of filesystem
			if (path.startsWith("/")) {
				absolutePath = normalize(path);
			} else {
				absolutePath = normalize(`${currentWorkingDirectory}/${path}`);
			}

			const node = findDirectory(absolutePath);

			if (node) {
				setCurrentWorkingDirectory(absolutePath);

				return "";
			}

			return `Terminal: cd: ${path} no such directory`;
		},
		[currentWorkingDirectory, findDirectory]
	);

	const onSubmit = useCallback(
		(event: SubmitEvent) => {
			event.preventDefault();
			const { program, args } = formatInput(input);

			switch (program) {
				case "cd": {
					cd(args.join());
					break;
				}
				case "broadcast": {
					console.log(ttys);
					// biome-ignore lint/complexity/noForEach: <explanation>
					ttys.forEach((tty) => tty.echo("teste"));
					break;
				}
				default: {
					pendingMode();
					createProcess(input, {
						id,
						workingDirectory: currentWorkingDirectory,
						echo,
						pendingMode,
						free
					});
				}
			}

			const output: TerminalOutput = {
				command: input,
				path: currentWorkingDirectory,
				username: "romera"
			};

			setOutputs((prevOutputs) => [...prevOutputs, output]);

			setInput("");
		},
		[
			id,
			input,
			currentWorkingDirectory,
			ttys,
			pendingMode,
			free,
			echo,
			cd,
			createProcess
		]
	);

	useEffect(() => {
		addTTY({ id, echo });
	}, [id, addTTY, echo]);

	return (
		<Wrapper onSubmit={onSubmit}>
			<TerminalOutputList outputs={outputs} />
			<div>
				<TerminalInput
					isPending={isPending}
					username={"romera"}
					nodePath={currentWorkingDirectory}
					input={{
						onInput: (event) => setInput(event.currentTarget.value),
						value: input
					}}
				/>
			</div>
		</Wrapper>
	);
}

const Wrapper = styled<"form">("form")({
	backgroundColor: "#000",
	fontWeight: 700,
	color: "#fff",
	width: "100%",
	height: "100%",
	overflowY: "scroll"
});
