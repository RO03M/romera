import { Box, styled } from "@mui/material";
import { motion, useMotionValue } from "framer-motion";
import { useGridSize } from "../../../../hooks/use-grid-size";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useDesktopItems } from "../../../../stores/desktop";
import { DragBackground } from "./drag-background";

interface ApplicationItemProps {
	id: number;
	gridPosition: [number, number];
	name: string;
}

export function ApplicationItem(props: ApplicationItemProps) {
	const { id, name, gridPosition } = props;

	const { updateDesktopItemPosition, isPositionFree, getItemById } = useDesktopItems();
	const [isFree, setIsFree] = useState(true);
	const [isDragging, setIsDragging] = useState(false);

	const gridSize = useGridSize();
	const { positionToGridPosition } = gridSize;

	const x = useMotionValue(gridPosition[0] * gridSize.width);
	const y = useMotionValue(gridPosition[1] * gridSize.height);
	const xDragBackground = useMotionValue(gridPosition[0] * gridSize.width);
	const yDragBackground = useMotionValue(gridPosition[1] * gridSize.height);

	const onDrag = useCallback(() => {
		const { x: newX, y: newY } = positionToGridPosition([x.get(), y.get()]);

		setIsFree(isPositionFree([newX, newY], [id]));
		xDragBackground.set(newX * gridSize.width);
		yDragBackground.set(newY * gridSize.height);
	}, [
		gridSize,
		x,
		y,
		xDragBackground,
		yDragBackground,
		id,
		positionToGridPosition,
		isPositionFree
	]);

	const onDragStart = useCallback(() => {
		setIsDragging(true);
	}, []);

	const onDragEnd = useCallback(() => {
		setIsDragging(false);
		const { x: newX, y: newY } = positionToGridPosition([x.get(), y.get()]);

		const isFree = isPositionFree([newX, newY], [id]);

		if (isFree) {
			updateDesktopItemPosition(id, [newX, newY]);
		} else {
			const oldItem = getItemById(id);

			updateDesktopItemPosition(id, oldItem?.gridPosition ?? [0, 0]);
		}
	}, [x, y, id, getItemById, isPositionFree, positionToGridPosition, updateDesktopItemPosition]);

	useEffect(() => {
		x.set(gridPosition[0] * gridSize.width);
		y.set(gridPosition[1] * gridSize.height);
	}, [gridPosition, x, y, gridSize]);

	return (
		<>
			{isDragging && (
				<DragBackground
					x={xDragBackground}
					y={yDragBackground}
					isFree={isFree}
				/>
			)}
			<motion.div
				drag
				onDrag={onDrag}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				dragTransition={{
					power: 0
				}}
				style={{
					position: "absolute",
					width: gridSize.width,
					height: gridSize.height,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					zIndex: isDragging ? 9999 : 0,
					x: x,
					y: y
				}}
			>
				<Wrapper />
				<span>{name}</span>
			</motion.div>
		</>
	);
}

const Wrapper = styled<"div">("div")({
	width: "50%",
	height: "50%",
	backgroundImage: `url("./application-icons/blank-icon.png")`,
	backgroundSize: "cover",
	backgroundPosition: "center"
});
