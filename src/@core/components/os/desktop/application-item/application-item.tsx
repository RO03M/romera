import { styled } from "@mui/material";
import { motion } from "framer-motion";
import { useGridSize } from "../../../../hooks/use-grid-size";
import { DragBackground } from "./drag-background";
import { useApplicationControl } from "./use-application-control";
import { useProcessesStore } from "../../../../processes/use-processes-store";
import { CodeEditor } from "../../../../../programs/code-editor";
import type { Node } from "../../../../filesystem/node";
import { useMemo } from "preact/hooks";
import { Explorer } from "../../../../../programs/explorer/explorer";
import { normalize } from "../../../../filesystem/utils/path";

interface ApplicationItemProps {
	name: string;
	type: Node["type"];
}

export function ApplicationItem(props: ApplicationItemProps) {
	const { name, type } = props;

	const { item, blur, itemComponentProps } = useApplicationControl(name);
	const { createWindowProcess } = useProcessesStore();

	const gridSize = useGridSize();

	const ExecutableComponent = useMemo(() => {
		switch (type) {
			case "file":
				return CodeEditor;
			case "directory":
				return Explorer;
			default:
				return CodeEditor;
		}
	}, [type]);

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
					onDblClickCapture={() =>
						createWindowProcess(ExecutableComponent, {
							workingDirectory: normalize(`/home/romera/desktop/${name}`)
						})
					}
				>
					<Icon />
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
