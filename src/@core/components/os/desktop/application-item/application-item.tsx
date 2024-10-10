import { motion } from "framer-motion";
import { useGridSize } from "../../../../hooks/use-grid-size";
import { DragBackground } from "./drag-background";
import { useApplicationControl } from "./use-application-control";
import { useProcessesStore } from "../../../../processes/use-processes-store";
import { normalize } from "../../../../filesystem/utils/path";
import styled from "styled-components";
import type { Stat } from "../../../../filesystem/stat";
import { useMemo, useRef, useState } from "preact/hooks";
import { getExecutableFromApplication } from "./get-executable-from-application";
import { programTable } from "../../../../../programs/program-table";
import { useClickOutside } from "../../../../hooks/use-click-outside";
import { NameDisplay } from "./name-display";

interface ApplicationItemProps {
	name: string;
	icon: string;
	type: Stat["type"];
}

export function ApplicationItem(props: ApplicationItemProps) {
	const { name, icon } = props;

	const [focused, setFocused] = useState(false);

	const ref = useRef<HTMLElement | null>(null);

	const { item, blur, itemComponentProps } = useApplicationControl(name);
	const { createWindowProcess } = useProcessesStore();

	const programName = useMemo(() => getExecutableFromApplication(name), [name]);
	const ProgramComponent = useMemo(
		() => programTable[programName],
		[programName]
	);

	const gridSize = useGridSize();

	useClickOutside(ref, () => setFocused(false));

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
				ref={ref}
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
					onClick={() => setFocused(true)}
					onDblClickCapture={() =>
						createWindowProcess(ProgramComponent, {
							workingDirectory: normalize(`/home/romera/desktop/${name}`)
						})
					}
				>
					<Icon style={{ backgroundImage: `url("${icon}")` }} />
					<NameDisplay focused={focused} value={name} />
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
