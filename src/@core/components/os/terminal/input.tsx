import { styled } from "@mui/material";
import { UnstyledInput } from "../../ui/inputs/unstyled-input";
import type { InputHTMLAttributes } from "preact/compat";

interface TerminalInputProps {
	input: InputHTMLAttributes<HTMLInputElement>;
	nodePath: string;
}

export function TerminalInput(props: TerminalInputProps) {
	const { nodePath, input } = props;

	return (
		<Wrapper>
			<NodePathTypography>{nodePath}</NodePathTypography>
			<UnstyledInput {...input} as={"input"} autoFocus onBlur={(event) => event.currentTarget.focus()} />
		</Wrapper>
	);
}

const Wrapper = styled<"div">("div")({
	position: "relative",
	display: "flex",
    flexDirection: "row"
});

const NodePathTypography = styled<"span">("span")({
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
