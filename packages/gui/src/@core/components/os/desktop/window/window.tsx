import { Topbar } from "./topbar";
import { useWindow } from "./use-window";
import { Suspense, useCallback, useRef, type ComponentType } from "preact/compat";
import type { ProcessComponentProps, ProcessComponentRef } from "../../../../processes/types";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { Kernel } from "@romos/kernel";

interface WindowProps {
	pid: number;
	contentArgs?: ProcessComponentProps;
	Content?: ComponentType<ProcessComponentProps>;
}

export function Window(props: WindowProps) {
	const { pid, contentArgs, Content } = props;
	
	const ref = useRef<Rnd | null>(null);
	const contentRef = useRef<ProcessComponentRef>(null);
	
	const windowProps = useWindow(ref);

	const handleClose = useCallback(() => {
		Kernel.instance().scheduler.kill(pid);
		if (contentRef.current !== null && contentRef.current?.onClose !== undefined) {
			contentRef.current.onClose();
		}
	}, [pid]);

	if (contentArgs === undefined) {
		return null;
	}

	return (
		<Wrapper
			aria-pid={pid}
			className={"window"}
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
			// onResize={(_, _, _, delta) => {
			// 	console.log("teste", delta);
			// }}
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
			<Topbar title={"debug"} onMaximizeClick={windowProps.toggleMaximization} onClose={handleClose} onPointerDown={() => {}} />
			<ContentWrapper className={"romos-window-content-container"}>
				<Suspense fallback={"..."}>
					{Content !== undefined && <Content ref={contentRef} {...contentArgs} />}
				</Suspense>
			</ContentWrapper>
		</Wrapper>
	);
}

const Wrapper = styled(Rnd)({
	borderRadius: 10,
	display: "flex !important",
	userSelect: "none",
	flexDirection: "column",
	backgroundColor: "#0f0f0f",
	zIndex: 1
});

const ContentWrapper = styled.div({
	flex: 1,
	maxHeight: "calc(100% - 40px)"
});
