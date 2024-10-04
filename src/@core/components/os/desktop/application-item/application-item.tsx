import { motion } from "framer-motion";
import { useGridSize } from "../../../../hooks/use-grid-size";
import { DragBackground } from "./drag-background";
import { useApplicationControl } from "./use-application-control";
import { useProcessesStore } from "../../../../processes/use-processes-store";
import { normalize } from "../../../../filesystem/utils/path";
import { useApplicationExecutable } from "./use-application-executable";
import styled from "styled-components";
import type { Stat } from "../../../../filesystem/stat";

interface ApplicationItemProps {
	name: string;
	type: Stat["type"];
	focused?: boolean;
	onFocus?: () => void;
}

export function ApplicationItem(props: ApplicationItemProps) {
	const { name, focused = false, onFocus } = props;

	const { item, blur, itemComponentProps } = useApplicationControl(name);
	const { iconRelativeUrl, programName, ProgramComponent } =
		useApplicationExecutable(name);
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
					focused={focused}
					aria-program-name={programName}
					aria-focused={focused}
					onClick={(event) => {
						event.stopPropagation();
						onFocus?.();
					}}
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

const ContentContainer = styled.div<{ focused: boolean }>((props) => ({
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: 4,
	backgroundColor: props.focused ? `${props.theme.colors.blue[500]}33` : "none",
	border: props.focused ? `1px dotted ${props.theme.colors.blue[500]}` : "none"
}));

const Icon = styled<"div">("div")({
	width: "50%",
	height: "50%",
	backgroundImage: `url("./application-icons/blank-icon.png")`,
	backgroundSize: "cover",
	backgroundPosition: "center"
});
