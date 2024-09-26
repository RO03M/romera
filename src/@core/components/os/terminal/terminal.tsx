import { styled } from "@mui/material";
import { TerminalInput } from "./input";
import { useCallback, useState } from "preact/hooks";
import { useFilesystem } from "../../../filesystem/use-filesystem";
import { formatInput } from "./utils/format-input";
import { normalize } from "../../../filesystem/utils/path";
import { type TerminalOutput, TerminalOutputList } from "./output-list";
import { useProcessesStore } from "../../../processes/use-processes-store";
import { incrementalId } from "../../../utils/incremental-id";

export function Terminal() {
	const [id] = useState(incrementalId("tty"));
	// Rename to currentWorkingDirectory
	const [currentNodePath, setCurrentNodePath] = useState("/");
	const [isPending, setIsPending] = useState(false);
	const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
	const [input, setInput] = useState("");

	const { cmd, findDirectory } = useFilesystem();
	const { processes, createProcess } = useProcessesStore();

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
				absolutePath = normalize(`${currentNodePath}/${path}`);
			}

			const node = findDirectory(absolutePath);

			if (node) {
				setCurrentNodePath(absolutePath);

				return "";
			}

			return `Terminal: cd: ${path} no such directory`;
		},
		[currentNodePath, findDirectory]
	);

	const onSubmit = useCallback(
		(event: SubmitEvent) => {
			event.preventDefault();
			const { program, args } = formatInput(input);
			let outputMessage = "";

			switch (program) {
				case "cd": {
					outputMessage = cd(args.join());
					break;
				}
				default: {
					pendingMode();
					createProcess(input, {
						id,
						workingDirectory: currentNodePath,
						echo,
						pendingMode,
						free
					});
				}
			}

			const output: TerminalOutput = {
				command: input,
				path: currentNodePath,
				username: "romera"
			};

			setOutputs((prevOutputs) => [...prevOutputs, output]);

			setInput("");
		},
		[
			id,
			input,
			currentNodePath,
			pendingMode,
			free,
			echo,
			cd,
			createProcess
		]
	);

	return (
		<Wrapper onSubmit={onSubmit}>
			<TerminalOutputList outputs={outputs} />
			<div>
				<TerminalInput
					isPending={isPending}
					username={"romera"}
					nodePath={currentNodePath}
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
