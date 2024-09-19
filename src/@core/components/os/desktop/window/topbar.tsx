import { ButtonBase, IconButton, styled, Typography } from "@mui/material";
import { type HTMLMotionProps, motion } from "framer-motion";
import { Row } from "../../../ui/row";
import { Icon } from "@iconify/react";
import { icons } from "../../../icons";

interface TopbarProp {
	onMaximizeClick?: () => void;
	onClose?: () => void;
	containerProps?: HTMLMotionProps<"div">;
	title: string;
}

export const Topbar = (props: TopbarProp) => {
	const { title, containerProps, onMaximizeClick, onClose } = props;
	return (
		<Wrapper
			{...containerProps}
		>
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

const Wrapper = styled(motion.div)({
	width: "100%",
	height: 25,
	display: "flex",
	justifyContent: "flex-end",
	borderRadius: "4px 4px 0 0",
	backgroundColor: "black"
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
