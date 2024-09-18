import { styled } from "@mui/material";
import { TerminalInput } from "./input";
import { useCallback, useState } from "preact/hooks";
import { useFilesystem } from "../../../filesystem/use-filesystem";
import { formatInput } from "./utils/format-input";
import { normalize } from "../../../filesystem/utils/path";
import { type TerminalOutput, TerminalOutputList } from "./output-list";

export function Terminal() {
	const [currentNodePath, setCurrentNodePath] = useState("/");
	const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
	const [input, setInput] = useState("");

	const { cmd, findDirectory } = useFilesystem();

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
					const { found, output: cmdOutput } = cmd(program, {
						args,
						bashContext: { path: currentNodePath }
					});

					if (found) {
						outputMessage = cmdOutput;
					} else {
						outputMessage = `Command ${program} not found`;
					}

					break;
				}
			}

			const output: TerminalOutput = {
				command: input,
				message: outputMessage,
				path: currentNodePath,
				username: "romera"
			};

			setOutputs((prevOutputs) => [...prevOutputs, output]);
			setInput("");
		},
		[input, currentNodePath, cd, cmd]
	);

	return (
		<Wrapper onSubmit={onSubmit}>
			<TerminalOutputList outputs={outputs} />
			<div>
				<TerminalInput
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
