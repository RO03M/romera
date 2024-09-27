import styled from "styled-components";
import { system } from "../../../../constants";

export function Dock() {
	return (
		<Wrapper>
			<Bar />
		</Wrapper>
	);
}

const Wrapper = styled.div({
	width: "100%",
	height: system.dockbar.height,
	display: "flex",
	justifyContent: "center",
	position: "absolute",
	bottom: 10
});

const Bar = styled.nav((props) => ({
	width: "80%",
	height: "100%",
	borderRadius: 5,
	backgroundColor: `${props.theme.colors.grey[800]}77`
}));
