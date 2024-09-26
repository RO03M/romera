import { styled } from "@mui/material";
import { motion, useDragControls } from "framer-motion";
import { Topbar } from "./topbar";
import { ResizeBar } from "./resize-bar";
import { useWindow } from "./use-window";
import { useCallback } from "preact/hooks";
import { Suspense, type ComponentType } from "preact/compat";
import type { ProcessComponentProps } from "../../../../processes/types";
import { useProcessesStore } from "../../../../processes/use-processes-store";

interface WindowProps {
	pid: number;
	contentArgs?: ProcessComponentProps;
	Content?: ComponentType<ProcessComponentProps>;
}

export function Window(props: WindowProps) {
	const { pid, contentArgs, Content } = props;

	const { killProcesses } = useProcessesStore();

	const windowProps = useWindow();

	const dragControls = useDragControls();

	const startDrag = useCallback(
		(event: PointerEvent) => dragControls.start(event),
		[dragControls]
	);

	return (
		<Wrapper
			aria-pid={pid}
			drag
			dragControls={dragControls}
			dragListener={false}
			dragTransition={{
				power: 0
			}}
			style={{
				x: windowProps.x,
				y: windowProps.y,
				left: windowProps.left,
				top: windowProps.top,
				width: windowProps.width,
				height: windowProps.height
			}}
			initial={{
				scale: 0.8
			}}
			animate={{
				scale: 1
			}}
		>
			<ResizeBar
				orientation={"horizontal"}
				horizontalAlignment={"center"}
				verticalAlignment={"start"}
				onDrag={windowProps.handleTopDrag}
			/>
			<ResizeBar
				orientation={"vertical"}
				horizontalAlignment={"end"}
				verticalAlignment={"center"}
				onDrag={windowProps.handleRightDrag}
			/>
			<ResizeBar
				orientation={"horizontal"}
				horizontalAlignment={"center"}
				verticalAlignment={"end"}
				onDrag={windowProps.handleBottomDrag}
			/>
			<ResizeBar
				orientation={"vertical"}
				horizontalAlignment={"start"}
				verticalAlignment={"center"}
				onDrag={windowProps.handleLeftDrag}
			/>
			<ResizeBar
				orientation={"corner"}
				horizontalAlignment={"start"}
				verticalAlignment={"start"}
				onDrag={windowProps.handleTopLeftDrag}
			/>
			<ResizeBar
				orientation={"corner"}
				horizontalAlignment={"end"}
				verticalAlignment={"start"}
				onDrag={windowProps.handleTopRightDrag}
			/>
			<ResizeBar
				orientation={"corner"}
				horizontalAlignment={"end"}
				verticalAlignment={"end"}
				onDrag={windowProps.handleBottomRightDrag}
			/>
			<ResizeBar
				orientation={"corner"}
				horizontalAlignment={"start"}
				verticalAlignment={"end"}
				onDrag={windowProps.handleBottomLeftDrag}
			/>
			<Topbar title={"debug"} onMaximizeClick={windowProps.toggleMaximization} onClose={() => killProcesses([pid])} onPointerDown={startDrag} />
			<ContentWrapper>
				<Suspense fallback={"..."}>
					{Content !== undefined && <Content {...contentArgs} />}
				</Suspense>
			</ContentWrapper>
		</Wrapper>
	);
}

const Wrapper = styled(motion.div)({
	position: "absolute",
	top: 0,
	left: 0,
	display: "flex",
	flexDirection: "column",
	backgroundColor: "#0f0f0f"
});

const ContentWrapper = styled<"div">("div")({
	flex: 1
});
