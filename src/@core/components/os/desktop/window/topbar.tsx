import { Icon } from "@iconify/react";
import { Typography, styled } from "@mui/material";
import { type HTMLMotionProps, motion } from "framer-motion";
import { icons } from "../../../icons";
import { Row } from "../../../ui/row";
import type { HTMLAttributes } from "preact/compat";

interface TopbarProp {
	onMaximizeClick?: () => void;
	onClose?: () => void;
	onPointerDown: (event: PointerEvent) => void;
	containerProps?: HTMLAttributes<HTMLDivElement>;
	title: string;
}

export const Topbar = (props: TopbarProp) => {
	const { title, onPointerDown, onMaximizeClick, onClose } = props;
	return (
		<Wrapper onPointerDown={onPointerDown} as={"div"}>
			<Title>{title}</Title>
			<Row>
				<Button>
					<Icon icon={icons.horizontalLine} />
				</Button>
				<Button onClick={onMaximizeClick}>
					<Icon icon={icons.square} />
				</Button>
				<Button onClick={onClose}>
					<Icon icon={icons.close} />
				</Button>
			</Row>
		</Wrapper>
	);
};

const Wrapper = styled<"div">("div", { label: "topbar" })({
	width: "100%",
	height: 40,
	display: "flex",
	justifyContent: "flex-end",
	alignItems: "center",
	borderRadius: "4px 4px 0 0",
	backgroundColor: "black",
	touchAction: "none"
	// backgroundColor: `#${Math.floor(Math.random() * 255 ** 3).toString(16)}`
});

const Title = styled(Typography)({
	flex: 1,
	marginLeft: 1,
	userSelect: "none"
});

const Button = styled<"div">("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	paddingInline: 10,
	"&:hover": {
		backgroundColor: "black"
	}
});
