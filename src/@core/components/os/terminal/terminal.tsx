import { TerminalInput } from "./input";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { formatInput } from "./utils/format-input";
import { normalize } from "../../../filesystem/utils/path";
import { type TerminalOutput, TerminalOutputList } from "./output-list";
import { incrementalId } from "../../../utils/incremental-id";
import type { ProcessComponentProps } from "../../../processes/types";
import { useTTYStore } from "../../../system/tty";
import { filesystem, processScheduler } from "../../../../app";
import styled from "styled-components";
import { useClickOutside } from "../../../hooks/use-click-outside";
import { Bash } from "./bash";

export function TerminalProgram(props: ProcessComponentProps) {
	const { workingDirectory = "/" } = props;

	const { ttys, addTTY } = useTTYStore();

	const [id] = useState(incrementalId("tty"));
	const [currentWorkingDirectory, setCurrentWorkingDirectory] =
		useState(workingDirectory);
	const [isPending, setIsPending] = useState(false);
	const [outputs, setOutputs] = useState<TerminalOutput[]>([]);

	const [focused, setFocused] = useState(true);

	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const echo = useCallback((message: string) => {
		const output: TerminalOutput = {
			message
		};

		setOutputs((prevOutputs) => [...prevOutputs, output]);
	}, []);

	const lock = useCallback(() => {
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
					lock();
					processScheduler.exec(program, args, {
						cwd: currentWorkingDirectory,
						tty: id
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
		[id, currentWorkingDirectory, ttys, lock, cd]
	);

	useEffect(() => {
		addTTY({ id, echo, free, lock });
	}, [id, addTTY, echo, free, lock]);

	useClickOutside(wrapperRef, () => setFocused(false));

	useEffect(() => {
		if (wrapperRef.current === null) {
			return;
		}

		const bash = new Bash(wrapperRef.current);
		// terminal.open(wrapperRef.current);
		// // terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
		// terminal.write("~$");
		// terminal.write("\x1b[C");
		// terminal.onKey(({ key, domEvent }) => {
		// 	const code = key.charCodeAt(0);
		// 	console.log(code, key.charAt(0), key, terminal.buffer.normal.cursorX);
		// 	if (code === 13) {
		// 		terminal.write("\r\n");
		// 		terminal.write("~$");
		// 		terminal.write("\x1b[C");
		// 		return;
		// 	}

		// 	if (code === 127) {
		// 		terminal.write("\x1b[D");
		// 		terminal.write("\x1b[P");
		// 		return;
		// 	}
		// 	terminal.write(key);
		// });
		// terminal.onKey(({ key, domEvent }) => {
		// 	if (domEvent.key === 'Backspace') {
		// 		terminal.write('\b \b');
		// 		return;
		// 	}
		// 	terminal.write(key);
		// 	// terminal.write('\x1b[D');
		// })
		return () => {
			bash.dispose();
		};
	}, []);

	return <div ref={wrapperRef} />;

	// return (
	// 	<Wrapper ref={wrapperRef} onClick={() => setFocused(true)}>
	// 		<TerminalOutputList outputs={outputs} />
	// 		<TerminalInput
	// 			focused={focused}
	// 			isPending={isPending}
	// 			username={"romera"}
	// 			nodePath={currentWorkingDirectory}
	// 			onSubmit={onSubmit}
	// 		/>
	// 	</Wrapper>
	// );
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
