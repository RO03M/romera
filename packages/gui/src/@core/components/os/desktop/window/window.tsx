import { Topbar } from "./topbar";
import { useWindow } from "./use-window";
import {
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
	type ComponentType
} from "preact/compat";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import { Kernel } from "@romos/kernel";
import type {
	ProcessComponentProps,
	ProcessComponentRef
} from "../../../../../programs/types";
import { WindowHierarchy } from "./window-hierarchy";
import { OrderChangeEvent } from "./order-change-event";
import styles from "./window.module.css";
import { VisibilityChangeEvent } from "./visibility-change-event";

interface WindowProps {
	pid: number;
	contentArgs?: ProcessComponentProps;
	Content?: ComponentType<ProcessComponentProps>;
}

export function Window(props: WindowProps) {
	const { pid, contentArgs, Content } = props;

	const [zindex, setZIndex] = useState(0);
	const [visible, setVisible] = useState(true);


	const ref = useRef<Rnd | null>(null);
	const contentRef = useRef<ProcessComponentRef>(null);

	const windowProps = useWindow(ref);

	const handleClose = useCallback(() => {
		Kernel.instance().scheduler.kill(pid);
		if (
			contentRef.current !== null &&
			contentRef.current?.onClose !== undefined
		) {
			contentRef.current.onClose();
		}
	}, [pid]);

	useEffect(() => {
		const index = WindowHierarchy.instance().getOrAllocate(pid);

		setZIndex(index);

		function onOrderChange(event: OrderChangeEvent) {
			if (pid !== event.detail.pid) {
				return;
			}

			setZIndex(event.detail.order);
		}

		document.addEventListener(OrderChangeEvent.key as any, onOrderChange);

		return () => {
			document.removeEventListener(OrderChangeEvent.key as any, onOrderChange);
		};
	}, [pid]);

	useEffect(() => {
		function onVisibilityChange(event: VisibilityChangeEvent) {
			if (event.detail.pid !== pid) {
				return;
			}

			if (event.detail.toggle) {
				setVisible((curr) => !curr);
				return;
			}

			setVisible(event.detail.visible);
		}

		document.addEventListener(VisibilityChangeEvent.key as any, onVisibilityChange);

		return () => {
			document.removeEventListener(VisibilityChangeEvent.key as any, onVisibilityChange);
		};
	}, [pid]);

	if (contentArgs === undefined) {
		return null;
	}

	return (
		<Rnd
			aria-pid={pid}
			className={styles.window}
			ref={ref}
			style={{
				zIndex: zindex,
				visibility: visible ? "inherit" : "hidden"
			}}
			dragHandleClassName={"topbar"}
			default={{
				width: 400,
				height: 400,
				x: window.innerWidth / 2 - 200,
				y: window.innerHeight / 2 - 200
			}}
			onDragStart={windowProps.onDragStart}
			onDragStop={() => contentRef.current?.focus?.()}
			position={windowProps.maximized ? { x: 0, y: 0 } : undefined}
			size={
				windowProps.maximized ? { width: "100%", height: "100%" } : undefined
			}
			onClick={() => console.log("teste")}
			onPointerDownCapture={() => {
				WindowHierarchy.instance().promote(pid);
				console.log("tete")
			}}
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
			<Topbar
				pid={props.pid}
				title={"debug"}
				onMaximizeClick={windowProps.toggleMaximization}
				onClose={handleClose}
				onPointerDown={() => {}}
			/>
			<ContentWrapper
				className={"romos-window-content-container"}
				onClick={() => console.log("hellow")}
			>
				<Suspense fallback={"..."}>
					{Content !== undefined && (
						<Content ref={contentRef} {...contentArgs} />
					)}
				</Suspense>
			</ContentWrapper>
		</Rnd>
	);
}

const ContentWrapper = styled.div({
	flex: 1,
	maxHeight: "calc(100% - 40px)"
});
