import { styled } from "@mui/material";
import { motion, useDragControls } from "framer-motion";
import { Topbar } from "./topbar";
import { ResizeBar } from "./resize-bar";
import { useWindow } from "./use-window";
import { useCallback } from "preact/hooks";
import { Suspense, type ComponentType } from "preact/compat";
import type { ProcessComponentProps } from "../../../../processes/types";
import { processScheduler } from "../../../../../app";
import { Rnd } from "react-rnd";

interface WindowProps {
	pid: number;
	contentArgs?: ProcessComponentProps;
	Content?: ComponentType<ProcessComponentProps>;
}

export function Window(props: WindowProps) {
	const { pid, contentArgs, Content } = props;
	
	const windowProps = useWindow();

	if (contentArgs === undefined) {
		return null;
	}

	return (
		<Wrapper
			aria-pid={pid}
			dragHandleClassName={"topbar"}
			size={{
				width: windowProps.width.get(),
				height: windowProps.height.get()
			}}
			resizeHandleStyles={{
				bottom: {
					cursor: "n-resize"
				},
				top: {
					cursor: "s-resize"
				},
				right: {
					cursor: "e-resize"
				},
				left: {
					cursor: "w-resize"
				}
			}}
		>
			<Topbar title={"debug"} onMaximizeClick={windowProps.toggleMaximization} onClose={() => processScheduler.kill(pid)} onPointerDown={() => {}} />
			<ContentWrapper>
				<Suspense fallback={"..."}>
					{Content !== undefined && <Content {...contentArgs} />}
				</Suspense>
			</ContentWrapper>
		</Wrapper>
	);
}

const Wrapper = styled(Rnd)({
	position: "absolute",
	top: 0,
	left: 0,
	display: "flex",
	userSelect: "none",
	flexDirection: "column",
	backgroundColor: "#0f0f0f",
	zIndex: 1
});

const ContentWrapper = styled<"div">("div")({
	flex: 1,
	maxHeight: "calc(100% - 40px)"
});
