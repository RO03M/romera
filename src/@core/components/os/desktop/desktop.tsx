import { styled } from "@mui/material";
// import { useGridSize } from "../../../hooks/use-grid-size";
import { ApplicationItem } from "./application-item";

export function Desktop() {
	// const { width, height } = useGridSize();

	return (
		<Wrapper id={"desktop-area"}>
			<ApplicationItem gridPosition={[0, 0]}/>
			<ApplicationItem gridPosition={[0, 1]}/>
		</Wrapper>
	);
}

const Wrapper = styled<"div">("div")({
	width: "100vw",
	height: "100vh",
	overflow: "hidden"
});
