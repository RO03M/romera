import { styled } from "@mui/material";
import { TerminalInput } from "./input";
import { useCallback, useState } from "preact/hooks";
import { useFilesystem } from "../../../filesystem/use-filesystem";
import { formatInput } from "./utils/format-input";
import { normalize } from "../../../filesystem/utils/path";

export function Terminal() {
	const [currentNodePath, setCurrentNodePath] = useState("/");
	const [outputs, setOutputs] = useState<string[]>([]);
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
			let output = "";

			switch (program) {
				case "cd": {
					output = cd(args.join());
					break;
				}
				default: {
					const { found, output: cmdOutput } = cmd(program, { args });

					if (found) {
						output = cmdOutput;
					} else {
						output = `Command ${program} not found`;
					}

					break;
				}
			}

			setOutputs((prevOutputs) => [...prevOutputs, output]);
			setInput("");
		},
		[input, cd, cmd]
	);

	return (
		<Wrapper onSubmit={onSubmit}>
			{outputs.map((input, key) => (
				<div key={`${key}-${input}`}>{input}</div>
			))}
            <div>
                <TerminalInput
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
	width: "100vw", // remover width e height
	height: "100vh"
});
