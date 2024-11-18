import {
	type ReactNode,
	createPortal,
	forwardRef,
	useCallback,
	useImperativeHandle,
	useState
} from "preact/compat";
import styled from "styled-components";

interface ContextMenuProps {
	children: ReactNode;
}

export type ContextMenuRef = {
	show: (event: MouseEvent) => void;
	close: () => void;
};

export const ContextMenu = forwardRef<ContextMenuRef, ContextMenuProps>(
	function ContextMenu(props, ref) {
		const { children } = props;

		const [x, setX] = useState(0);
		const [y, setY] = useState(0);
		const [open, setOpen] = useState(false);

		const show = useCallback((event: MouseEvent) => {
			event.preventDefault();

			setX(event.pageX);
			setY(event.pageY);
			setOpen(true);
		}, []);

		useImperativeHandle(ref, () => {
			return {
				show,
				close: () => setOpen(false)
			};
		});

		if (!open) {
			return null;
		}

		return (
			<>
				{createPortal(
					<Wrapper $x={x} $y={y}>
						{children}
					</Wrapper>,
					document.body
				)}
			</>
		);
	}
);

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
	zIndex: 1000,
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
				content: "'>'"
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
