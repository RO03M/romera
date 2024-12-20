import { Icon } from "@iconify/react";
import type { HTMLAttributes } from "preact/compat";
import styled from "styled-components";
import { icons } from "../../../icons";
import { Row } from "../../../ui/row";

interface TopbarProp {
	onMaximizeClick?: () => void;
	onClose?: () => void;
	onPointerDown: (event: PointerEvent) => void;
	containerProps?: HTMLAttributes<HTMLDivElement>;
	title: string;
}

export const Topbar = (props: TopbarProp) => {
	const { onPointerDown, onMaximizeClick, onClose } = props;
	return (
		<Wrapper
			onPointerDown={onPointerDown}
			as={"div"}
			aria-description={"window-topbar"}
			aria-testid={"window-topbar"}
		>
			<DragHandler className={"topbar"} />
			<Row>
				<TopbarButton className={"minimize-button"}>
					<Icon icon={icons.horizontalLine} />
				</TopbarButton>
				<TopbarButton className={"maximize-button"} onClick={onMaximizeClick}>
					<Icon icon={icons.square} />
				</TopbarButton>
				<TopbarButton
					style={{ borderStartEndRadius: 10 }}
					className={"close-button"}
					closeButton
					onClick={onClose}
				>
					<Icon icon={icons.close} />
				</TopbarButton>
			</Row>
		</Wrapper>
	);
};

const DragHandler = styled.nav({
	flex: 1
});

const Wrapper = styled.div(
	(props) => ({
		height: 30,
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		borderRadius: "10px 10px 0 0",
		backgroundColor: props.theme.colors.grey[700],
		touchAction: "none",
		"& > *": {
			height: "100%"
		}
	}),
	{
		name: "window-topbar"
	}
);

const TopbarButton = styled.div<{ closeButton?: boolean }>((props) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	paddingInline: 10,
	transition: "240ms",
	"&:hover": {
		backgroundColor: props.closeButton
			? props.theme.colors.red[500]
			: props.theme.colors.grey[900]
	}
}));
