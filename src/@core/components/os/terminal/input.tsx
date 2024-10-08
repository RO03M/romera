import { useEffect, useState } from "preact/compat";
import { LineStart } from "./line-start";
import styled, { css, keyframes } from "styled-components";
import { clamp } from "../../../utils/math";

interface TerminalInputProps {
	isPending?: boolean;
	nodePath: string;
	username: string;
	focused: boolean;
	onSubmit: (value: string) => void;
}

export function TerminalInput(props: TerminalInputProps) {
	const { nodePath, focused, username, onSubmit, isPending = false } = props;

	const [value, setValue] = useState("");
	const [caretPosition, setCaretPosition] = useState(0);

	useEffect(() => {
		async function onKeyDown(event: KeyboardEvent) {
			event.preventDefault();
			const { key, ctrlKey } = event;

			if (key === "Enter") {
				onSubmit?.(value);
				setValue("");
				setCaretPosition(0);
			}

			if (key === "Home") {
				setCaretPosition(0);
				return;
			}

			if (key === "End") {
				setCaretPosition(value.length);
			}

			if (ctrlKey && key === "ArrowLeft") {
				setCaretPosition(0); // Dps tem que ajeitar isso para ir para a palavra mais próxima
				return;
			}

			if (ctrlKey && key === "ArrowRight") {
				setCaretPosition(value.length); // Dps tem que ajeitar isso para ir para a palavra mais próxima
				return;
			}

			if (ctrlKey && key.toLowerCase() === "v") {
				const clipboardContent = await navigator.clipboard.readText();
				
				setValue((prev) => {
					return [
						prev.slice(0, caretPosition),
						clipboardContent,
						prev.slice(caretPosition)
					].join("");
				});
				setCaretPosition((prev) => prev + clipboardContent.length);
				return;
			}

			if (key === "ArrowRight") {
				setCaretPosition((prev) => clamp(0, prev + 1, value.length));
				return;
			}

			if (key === "ArrowLeft") {
				setCaretPosition((prev) => clamp(0, prev - 1, value.length));
				return;
			}

			if (key === "Backspace") {
				setValue((prev) => {
					return prev.slice(0, caretPosition - 1) + prev.slice(caretPosition);
				});
				setCaretPosition((prev) => clamp(prev - 1, 0));
				return;
			}

			if (key === "Delete") {
				setValue((prev) => {
					return prev.slice(0, caretPosition) + prev.slice(caretPosition + 1);
				});
			}

			if (key.length === 1) {
				setValue((prev) => {
					return [
						prev.slice(0, caretPosition),
						key,
						prev.slice(caretPosition)
					].join("");
				});
				setCaretPosition((prev) => prev + 1);
				return;
			}
		}

		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [value, caretPosition, onSubmit]);

	return (
		<Wrapper $isPending={isPending} aria-details={value}>
			<LineStart username={username} path={nodePath} />
			<span style={{ letterSpacing: 0 }}>{value.slice(0, caretPosition)}</span>
			{value.length === caretPosition ? (
				<Caret $animate={focused}>&nbsp;&nbsp;</Caret>
			) : (
				<Caret $animate={focused}>
					{value.slice(caretPosition, caretPosition + 1)}
				</Caret>
			)}
			<span style={{ letterSpacing: 0 }}>{value.slice(caretPosition + 1)}</span>
		</Wrapper>
	);
}

const Wrapper = styled.div<{ $isPending: boolean }>((props) => ({
	position: "relative",
	display: props.$isPending ? "none" : "flex",
	flexDirection: "row",
	whiteSpace: "pre",
	letterSpacing: 0.7
}));

export const NodePathTypography = styled.span({
	color: "darkblue",
	"&::after": {
		content: "'$'",
		color: "white"
	}
});

const caretAnimation = keyframes`
	0% {
		background-color: white;
		color: black;
	}
	100% {
		background-color: black;
		color: white;
	}
`;

const blinkAnimationCss = css`
	animation: ${caretAnimation} 1s steps(2, jump-none) infinite;
`;

const Caret = styled.span<{ $animate: boolean }>`
	letter-spacing: 0px;
	${(props) => (props.$animate ? blinkAnimationCss : "")}
`;
