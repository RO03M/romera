// import { motion, type PanInfo } from "framer-motion";
// import { useMemo } from "preact/hooks";

// const THICKNESS = 5;

// interface ResizeBarProps {
// 	orientation: "vertical" | "horizontal" | "corner";
// 	verticalAlignment: "start" | "center" | "end";
// 	horizontalAlignment: "start" | "center" | "end";
// 	onDrag?: (
// 		event: MouseEvent | TouchEvent | PointerEvent,
// 		info: PanInfo
// 	) => void;
// }

// export function ResizeBar(props: ResizeBarProps) {
// 	const { orientation, verticalAlignment, horizontalAlignment, onDrag } = props;

// 	const [width, height] = useMemo(() => {
// 		switch (orientation) {
// 			case "vertical":
// 				return [THICKNESS, "100%"];
// 			case "corner":
// 				return [THICKNESS * 2.5, THICKNESS * 2.5];
// 			case "horizontal":
// 				return ["100%", THICKNESS];
// 		}
// 	}, [orientation]);

// 	const dragFlag = useMemo(() => {
// 		return true;
// 		// switch (orientation) {
// 		// 	case "vertical":
// 		// 		return "y";
// 		// 	case "horizontal":
// 		// 		return "x";
// 		// 	case "corner":
// 		// 		return true;
// 		// }
// 	}, []);

// 	const [top, bottom] = useMemo(() => {
// 		switch (verticalAlignment) {
// 			case "center":
// 				return ["unset", "unset"];
// 			case "start":
// 				return [-5, "unset"];
// 			case "end":
// 				return ["unset", -5];
// 		}
// 	}, [verticalAlignment]);

// 	const [left, right] = useMemo(() => {
// 		switch (horizontalAlignment) {
// 			case "center":
// 				return ["unset", "unset"];
// 			case "start":
// 				return [-5, "unset"];
// 			case "end":
// 				return ["unset", -5];
// 		}
// 	}, [horizontalAlignment]);

// 	const cursor = useMemo(() => {
// 		const foda = {
// 			center: {
// 				center: "inherit",
// 				start: "s-resize",
// 				end: "n-resize"
// 			},
// 			start: {
// 				center: "w-resize",
// 				start: "se-resize",
// 				end: "sw-resize"
// 			},
// 			end: {
// 				center: "e-resize",
// 				start: "ne-resize",
// 				end: "nw-resize"
// 			}
// 		};

// 		return foda[horizontalAlignment][verticalAlignment] ?? "help";
// 	}, [verticalAlignment, horizontalAlignment]);

// 	return (
// 		<motion.div
// 			drag={dragFlag}
// 			dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
// 			dragElastic={0}
// 			dragMomentum={false}
// 			onDrag={onDrag}
// 			style={{
// 				width,
// 				height,
// 				top,
// 				bottom,
// 				left,
// 				right,
// 				cursor,
// 				position: "absolute",
// 				touchAction: "none"
// 			}}
// 		/>
// 	);
// }
