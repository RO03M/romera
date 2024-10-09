import { useEffect, useRef, useState, type ReactNode } from "preact/compat";
import styled from "styled-components";
import { useClickOutside } from "../../../hooks/use-click-outside";

interface ContextMenuProps {
	children: ReactNode;
}

export function ContextMenu(props: ContextMenuProps) {
	const { children } = props;

	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLElement | null>(null);

	useClickOutside(ref, () => setOpen(false));

	useEffect(() => {
		document.addEventListener("contextmenu", (event) => {
			event.preventDefault();
			event.stopPropagation();

			setX(event.clientX);
			setY(event.clientY);
			setOpen(true);
		});
	}, []);

	if (!open) {
		return null;
	}

	return (
		<Wrapper ref={ref} $x={x} $y={y}>
			{children}
		</Wrapper>
	);
}

const Wrapper = styled.nav<{ $x: number; $y: number }>((props) => ({
	position: "absolute",
	borderRadius: 8,
	padding: 4,
	listStyle: "none",
	top: props.$y,
	left: props.$x,
	backgroundColor: `${props.theme.colors.grey[800]}55`,
	backdropFilter: "blur(4px)",
	userSelect: "none",
	"& li": {
		position: "relative",
		borderRadius: 6,
		padding: 2,
		paddingInline: 4,
		cursor: "pointer",
		"&:hover": {
			backgroundColor: `${props.theme.colors.grey[700]}77`
		},
		"& > ul": {
			display: "none"
		},
		"&:hover > ul": {
			display: "inherit"
		},
		"&:has(ul)": {
			"&:after": {
				content: "'>'",
				position: "absolute",
				right: 0
			}
		}
	},
	"& ul": {
		backgroundColor: `${props.theme.colors.grey[800]}55`,
		position: "absolute",
		listStyle: "none",
		margin: 0,
		padding: 0,
		left: "100%",
		top: 0,
		width: "100%"
	}
}));
