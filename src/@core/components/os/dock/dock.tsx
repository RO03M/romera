import styled from "styled-components";

export function Dock() {
	return <Wrapper />;
}

const Wrapper = styled.nav((props) => ({
	width: "100%",
	height: 40,
	position: "absolute",
    backgroundColor: props.theme.colors.grey[800],
	bottom: 0
}));
