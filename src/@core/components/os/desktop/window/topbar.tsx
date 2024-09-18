import {
	Box,
	type BoxProps,
	ButtonBase,
	styled,
	Typography
} from "@mui/material";
import { type HTMLMotionProps, motion } from "framer-motion";
import { Row } from "../../../ui/row";

interface TopbarProp {
	onMaximizeClick?: () => void;
	onClose?: () => void;
	containerProps?: HTMLMotionProps<"div">;
	title: string;
}

export const Topbar = (props: TopbarProp) => {
	const { title, containerProps, onMaximizeClick, onClose } = props;
	return (
		<Wrapper {...containerProps}>
			<Title>
				{title}
			</Title>
			<Row>
				<ButtonBase>-</ButtonBase>
				<ButtonBase onClick={onMaximizeClick}>□</ButtonBase>
				<ButtonBase onClick={onClose}>x</ButtonBase>
			</Row>
		</Wrapper>
	);
};

const Wrapper = styled(motion.div)({
	width: "100%",
	height: 25,
	display: "flex",
	justifyContent: "flex-end",
	borderRadius: "4px 4px 0 0",
    backgroundColor: `#${Math.floor(Math.random() * 255 ** 3).toString(16)}`
});

const Title = styled(Typography)({
	flex: 1,
	marginLeft: 1,
	userSelect: "none"
});
