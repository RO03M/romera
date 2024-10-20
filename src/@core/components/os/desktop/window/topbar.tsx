import { Icon } from "@iconify/react";
import { icons } from "../../../icons";
import { Row } from "../../../ui/row";
import type { HTMLAttributes } from "preact/compat";
import styled from "styled-components";

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
		<Wrapper onPointerDown={onPointerDown} as={"div"}>
			<DragHandler className={"topbar"} />
			<Row>
				<TopbarButton>
					<Icon icon={icons.horizontalLine} />
				</TopbarButton>
				<TopbarButton onClick={onMaximizeClick}>
					<Icon icon={icons.square} />
				</TopbarButton>
				<TopbarButton closeButton onClick={onClose}>
					<Icon icon={icons.close} />
				</TopbarButton>
			</Row>
		</Wrapper>
	);
};

const DragHandler = styled.nav({
	flex: 1
})

const Wrapper = styled.div(
	{
		height: 40,
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		borderRadius: "4px 4px 0 0",
		backgroundColor: "black",
		touchAction: "none",
		"& > *": {
			height: "100%"
		}
	},
	{
		name: "window-topbar"
	}
);

const TopbarButton = styled.div<{ closeButton?: boolean }>((props) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	paddingInline: 10,
	"&:hover": {
		backgroundColor: props.closeButton
			? props.theme.colors.red[500]
			: props.theme.colors.grey[900]
	}
}));
