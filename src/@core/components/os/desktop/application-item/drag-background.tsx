// import { type MotionValue, motion } from "framer-motion";
// import { useGridSize } from "../../../../hooks/use-grid-size";

// interface DragBackgroundProps {
// 	x: MotionValue<number>;
// 	y: MotionValue<number>;
//     isFree: boolean;
// }

// export function DragBackground(props: DragBackgroundProps) {
// 	const { x, y, isFree } = props;
//     const gridSize = useGridSize();

// 	return (
// 		<motion.div
// 			style={{
// 				x,
// 				y,
// 				position: "absolute",
// 				width: gridSize.width,
// 				height: gridSize.height,
// 				backgroundColor: isFree ? "rgba(0, 0, 0, 0.2)" : "rgba(100, 0, 0, 0.2)",
// 				borderRadius: "16px",
// 				backdropFilter: "blur(7px)",
// 				zIndex: 9999,
// 				border: "1px solid rgba(255, 255, 255, 0.03)"
// 			}}
// 		/>
// 	);
// }
