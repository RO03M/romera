import { styled } from "@mui/material";
import { UnstyledInput } from "../../ui/inputs/unstyled-input";
import type { InputHTMLAttributes } from "preact/compat";
import { LineStart } from "./line-start";

interface TerminalInputProps {
	input: InputHTMLAttributes<HTMLInputElement>;
	nodePath: string;
	username: string;
}

export function TerminalInput(props: TerminalInputProps) {
	const { nodePath, username, input } = props;

	return (
		<Wrapper>
			<LineStart
				username={username}
				path={nodePath}
			/> 
			<UnstyledInput {...input} as={"input"} autoFocus onBlur={(event) => event.currentTarget.focus()} />
		</Wrapper>
	);
}

const Wrapper = styled<"div">("div")({
	position: "relative",
	display: "flex",
    flexDirection: "row"
});

export const NodePathTypography = styled<"span">("span")({
    color: "darkblue",
    "&::after": {
        content: "'$'",
        color: "white"
    }
});

// const Caret = styled<"div">("div")({
//     position: "absolute",
//     left: 0,
//     top: 0,
//     width: 10,
//     height: "100%",
//     backgroundColor: "white"
// });
