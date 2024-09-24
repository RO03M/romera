// import { type HTMLMotionProps, useMotionValue } from "framer-motion";
// import { useCallback, useEffect, useState } from "preact/hooks";
// import { useGridSize } from "../../../../hooks/use-grid-size";
// import { useDesktopItems } from "../../../../stores/desktop";
// import { positionToGridPosition } from "../../../../utils/grid";

// interface ApplicationItemActionsProps {
// 	itemId: number;
// 	gridPosition: [number, number];
// }

// export function useApplicationItemActions(props: ApplicationItemActionsProps) {
// 	const { gridPosition, itemId } = props;

// 	const { updateDesktopItemPosition, isPositionFree, getItemById } =
// 		useDesktopItems();
// 	const [isFree, setIsFree] = useState(true);
// 	const [isDragging, setIsDragging] = useState(false);
// 	const [isHover, setIsHover] = useState(false);

// 	const gridSize = useGridSize();

// 	const x = useMotionValue(gridPosition[0] * gridSize.width);
// 	const y = useMotionValue(gridPosition[1] * gridSize.height);
// 	const xBlur = useMotionValue(gridPosition[0] * gridSize.width);
// 	const yBlur = useMotionValue(gridPosition[1] * gridSize.height);

// 	const resetPosition = useCallback(() => {
// 		const oldItem = getItemById(itemId);

// 		const gridPosition = oldItem?.gridPosition ?? [0, 0]

// 		updateDesktopItemPosition(itemId, gridPosition);
// 		xBlur.set(gridPosition[0] * gridSize.width);
// 		yBlur.set(gridPosition[1] * gridSize.height);
// 		setIsFree(true);
// 	}, [itemId, gridSize, xBlur, yBlur, getItemById, updateDesktopItemPosition]);

// 	const onDrag = useCallback(() => {
// 		const { x: newX, y: newY } = positionToGridPosition([x.get(), y.get()]);

// 		setIsFree(isPositionFree([newX, newY], [itemId]));
// 		xBlur.set(newX * gridSize.width);
// 		yBlur.set(newY * gridSize.height);
// 	}, [gridSize, x, y, xBlur, yBlur, itemId, isPositionFree]);

// 	const onDragStart = useCallback(() => {
// 		setIsDragging(true);
// 	}, []);

// 	const onDragEnd = useCallback(() => {
// 		setIsDragging(false);
// 		const { x: newX, y: newY } = positionToGridPosition([x.get(), y.get()]);

// 		const isFree = isPositionFree([newX, newY], [itemId]);

// 		if (isFree) {
// 			updateDesktopItemPosition(itemId, [newX, newY]);
// 		} else {
// 			resetPosition();
// 		}
// 	}, [x, y, itemId, resetPosition, isPositionFree, updateDesktopItemPosition]);

// 	const onHoverStart = useCallback(() => {
// 		setIsHover(true);
// 	}, []);

// 	const onHoverEnd = useCallback(() => {
// 		setIsHover(false);
// 	}, []);

// 	useEffect(() => {
// 		x.set(gridPosition[0] * gridSize.width);
// 		y.set(gridPosition[1] * gridSize.height);
// 	}, [gridPosition, x, y, gridSize]);

// 	return {
// 		itemComponentProps: {
// 			onDrag,
// 			onDragStart,
// 			onDragEnd,
// 			onHoverStart,
// 			onHoverEnd
// 		} as HTMLMotionProps<"div">,
// 		item: {
// 			position: {
// 				x,
// 				y
// 			}
// 		},
// 		blur: {
// 			position: {
// 				x: xBlur,
// 				y: yBlur
// 			},
// 			show: isDragging || isHover,
// 			isFree,
// 			isDragging,
// 			isHover
// 		}
// 	};
// }
