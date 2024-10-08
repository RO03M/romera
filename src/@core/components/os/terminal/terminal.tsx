import { TerminalInput } from "./input";
import { useCallback, useEffect, useState } from "preact/hooks";
import { formatInput } from "./utils/format-input";
import { normalize } from "../../../filesystem/utils/path";
import { type TerminalOutput, TerminalOutputList } from "./output-list";
import { useProcessesStore } from "../../../processes/use-processes-store";
import { incrementalId } from "../../../utils/incremental-id";
import type { ProcessComponentProps } from "../../../processes/types";
import { useTTYStore } from "../../../system/tty";
import { filesystem } from "../../../../app";
import styled from "styled-components";

export function Terminal(props: ProcessComponentProps) {
	const { workingDirectory = "/" } = props;

	const { ttys, addTTY } = useTTYStore();

	const [id] = useState(incrementalId("tty"));
	const [currentWorkingDirectory, setCurrentWorkingDirectory] =
		useState(workingDirectory);
	const [isPending, setIsPending] = useState(false);
	const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
	// const [input, setInput] = useState("");

	const [focused, setFocused] = useState(true);

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

			const stat = filesystem.stat(absolutePath);

			if (stat) {
				setCurrentWorkingDirectory(absolutePath);

				return "";
			}

			return `Terminal: cd: ${path} no such directory`;
		},
		[currentWorkingDirectory]
	);

	const onSubmit = useCallback(
		(input: string) => {
			const { program, args } = formatInput(input);

			switch (program) {
				case "cd": {
					cd(args.join());
					break;
				}
				case "broadcast": {
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
		},
		[
			id,
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

	useEffect(() => {
		function loseFocus() {
			setFocused(false);
		}
		document.addEventListener("click", loseFocus);

		return () => {
			document.removeEventListener("click", loseFocus);
		};
	}, []);

	return (
		<Wrapper
			onClick={(event) => {
				event.stopPropagation();
				setFocused(true);
			}}
		>
			<TerminalOutputList outputs={outputs} />
			<TerminalInput
				focused={focused}
				isPending={isPending}
				username={"romera"}
				nodePath={currentWorkingDirectory}
				onSubmit={onSubmit}
			/>
		</Wrapper>
	);
}

const Wrapper = styled.div({
	backgroundColor: "#000",
	fontWeight: 700,
	color: "#fff",
	width: "100%",
	height: "100%",
	overflowY: "scroll",
	textRendering: "optimizeLegibility",
	whiteSpace: "pre",
	letterSpacing: 0.7
});
