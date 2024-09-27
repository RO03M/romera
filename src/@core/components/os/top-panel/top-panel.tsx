import styled from "styled-components";
import { system } from "../../../../constants";

export function TopPanel() {
	return <Wrapper />;
}

const Wrapper = styled.div((props) => ({
	width: "100%",
	height: system.topPanel.height,
	position: "absolute",
	backgroundColor: `${props.theme.colors.grey[800]}cc`
}));
