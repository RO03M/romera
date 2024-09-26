import { LineStart } from "./line-start";

export interface TerminalOutput {
	username?: string;
	path?: string;
	command?: string;
	message: string;
}

interface TerminalOutputListProps {
	outputs: TerminalOutput[];
}

export function TerminalOutputList(props: TerminalOutputListProps) {
	const { outputs } = props;

	return (
		<div>
			{outputs.map((output, key) => (
				<div
					style={{ whiteSpace: "pre-wrap" }}
					key={`output-${key}-${output.username}`}
				>
					
					<LineStart
						username={output.username}
						command={output.command}
						path={output.path}
					/>
					<div>{output.message}</div>
				</div>
			))}
		</div>
	);
}
