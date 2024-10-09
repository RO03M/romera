import { useEffect, useRef, useState, type ReactNode } from "preact/compat";
import styled from "styled-components";

interface ContextMenuProps {
	children: ReactNode;
}

export function ContextMenu(props: ContextMenuProps) {
	const { children } = props;

	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLElement | null>(null);

	useEffect(() => {
		document.addEventListener("contextmenu", (event) => {
			event.preventDefault();
			event.stopPropagation();

			setX(event.clientX);
			setY(event.clientY);
			setOpen(true);
		});

		document.addEventListener("click", () => {
			setOpen(false);
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
	minWidth: 100,
	"& li": {
		position: "relative",
		borderRadius: 6,
		cursor: "pointer",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
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
				// position: "absolute",
				// right: 10
			}
		}
	},
	"& ul": {
		display: "flex",
		flexDirection: "column",
		backgroundColor: `${props.theme.colors.grey[800]}55`,
		position: "absolute",
		listStyle: "none",
		margin: 0,
		padding: 7,
		left: "100%",
		top: 0,
		minWidth: "100%"
	}
}));
