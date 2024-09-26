import { styled } from "@mui/material";
import { motion } from "framer-motion";
import { useGridSize } from "../../../../hooks/use-grid-size";
import { DragBackground } from "./drag-background";
import { useApplicationControl } from "./use-application-control";
import { useProcessesStore } from "../../../../processes/use-processes-store";
import type { Node } from "../../../../filesystem/node";
import { normalize } from "../../../../filesystem/utils/path";
import { useApplicationExecutable } from "./use-application-executable";

interface ApplicationItemProps {
	name: string;
	type: Node["type"];
}

export function ApplicationItem(props: ApplicationItemProps) {
	const { name } = props;

	const { item, blur, itemComponentProps } = useApplicationControl(name);
	const { iconRelativeUrl, programName, ProgramComponent } = useApplicationExecutable(name);
	const { createWindowProcess } = useProcessesStore();

	const gridSize = useGridSize();

	return (
		<>
			{blur.show && (
				<DragBackground
					x={blur.position.x}
					y={blur.position.y}
					isFree={blur.isFree}
				/>
			)}
			<motion.div
				drag
				{...itemComponentProps}
				dragTransition={{
					power: 0
				}}
				style={{
					position: "absolute",
					width: gridSize.width,
					height: gridSize.height,
					zIndex: blur.show ? 9999 : 0,
					x: item.position.x,
					y: item.position.y
				}}
			>
				<ContentContainer
					aria-program-name={programName}
					onDblClickCapture={() =>
						createWindowProcess(ProgramComponent, {
							workingDirectory: normalize(`/home/romera/desktop/${name}`)
						})
					}
				>
					<Icon style={{ backgroundImage: `url("${iconRelativeUrl}")` }} />
					<span>{name}</span>
				</ContentContainer>
			</motion.div>
		</>
	);
}

const ContentContainer = styled<"div">("div")({
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center"
});

const Icon = styled<"div">("div")({
	width: "50%",
	height: "50%",
	backgroundImage: `url("./application-icons/blank-icon.png")`,
	backgroundSize: "cover",
	backgroundPosition: "center"
});
