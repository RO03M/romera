import styled from "styled-components";
import { system } from "../../../../constants";
import { LeftSide } from "./left-side";
import { RightSide } from "./right-side";

export function TopPanel() {
	return (
		<Wrapper>
			<LeftSide />
			<RightSide />
		</Wrapper>
	);
}

const Wrapper = styled.div((props) => ({
	width: "100%",
	height: system.topPanel.height,
	position: "absolute",
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	backgroundColor: `${props.theme.colors.grey[800]}cc`,
	"& > *": {
		paddingInline: 4
	}
}));
