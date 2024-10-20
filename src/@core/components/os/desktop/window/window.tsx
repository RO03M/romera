import { styled } from "@mui/material";
import { Topbar } from "./topbar";
import { useWindow } from "./use-window";
import { Suspense, useRef, type ComponentType } from "preact/compat";
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
	
	const ref = useRef<Rnd | null>(null);
	
	const windowProps = useWindow(ref);

	if (contentArgs === undefined) {
		return null;
	}

	return (
		<Wrapper
			aria-pid={pid}
			ref={ref}
			dragHandleClassName={"topbar"}
			default={{
				width: 400,
				height: 400,
				x: window.innerWidth / 2 - 200,
				y: window.innerHeight / 2 - 200
			}}
			onDragStart={windowProps.onDragStart}
			position={windowProps.maximized ? { x: 0, y: 0 } : undefined}
			size={windowProps.maximized ? { width: "100%", height: "100%" } : undefined}
			enableUserSelectHack={false}
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
	display: "flex !important",
	userSelect: "none",
	flexDirection: "column",
	backgroundColor: "#0f0f0f",
	zIndex: 1
});

const ContentWrapper = styled<"div">("div")({
	flex: 1,
	maxHeight: "calc(100% - 40px)"
});
