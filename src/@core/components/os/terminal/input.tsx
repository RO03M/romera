import { UnstyledInput } from "../../ui/inputs/unstyled-input";
import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	type InputHTMLAttributes
} from "preact/compat";
import { LineStart } from "./line-start";
import styled from "styled-components";
import { MutableRef } from "preact/hooks";

interface TerminalInputProps {
	isPending?: boolean;
	input: InputHTMLAttributes<HTMLInputElement>;
	nodePath: string;
	username: string;
}

export const TerminalInput = forwardRef<
	HTMLInputElement | null,
	TerminalInputProps
>(function TerminalInput(props, ref) {
	const { nodePath, username, input, isPending = false } = props;

	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (!isPending && inputRef?.current) {
			inputRef.current.focus();
		}
	}, [isPending]);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			console.log(inputRef.current?.selectionStart, inputRef.current?.selectionEnd);
		}

		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown)
		}
	}, []);

	return (
		<Wrapper $isPending={isPending}>
			<LineStart username={username} path={nodePath} />
			<Input
				{...input}
				as={"input"}
				ref={(element) => {
					inputRef.current = element;
					if (typeof ref === "function") {
						ref(element);
					} else if (ref) {
						ref.current = element;
					}
				}}
			/>
		</Wrapper>
	);
});

const Wrapper = styled.div<{ $isPending: boolean }>((props) => ({
	position: "relative",
	display: props.$isPending ? "none" : "flex",
	flexDirection: "row"
}));

export const NodePathTypography = styled.span({
	color: "darkblue",
	"&::after": {
		content: "'$'",
		color: "white"
	}
});

const Input = styled(UnstyledInput)({
	width: "100%",
	background: "none",
	border: "none",
	outline: "none"
	// caretColor: "transparent"
});

// const Caret = styled<"div">("div")({
//     position: "absolute",
//     left: 0,
//     top: 0,
//     width: 10,
//     height: "100%",
//     backgroundColor: "white"
// });
