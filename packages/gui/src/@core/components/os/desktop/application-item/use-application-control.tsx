// import { useCallback, useMemo, useState } from "preact/hooks";
// import { useGridSize } from "../../../../hooks/use-grid-size";
// import { type HTMLMotionProps, useMotionValue } from "framer-motion";
// import { positionToGridPosition } from "../../../../utils/grid";
// import { system } from "../../../../../constants";
// import {
// 	ApplicationConfig,
// 	getConfigFromApplication
// } from "./application-config-file";
// import { filesystem } from "../../../../../app";
// import { isGridPositionFree } from "./is-grid-position-free";

// const yOffset = system.topPanel.height;

// export function useApplicationControl(applicationName: string) {
// 	const [lastGridPosition, setLastGridPosition] = useState({ x: 0, y: 0 });
// 	const [isFree, setIsFree] = useState(true);
// 	const [isDragging, setIsDragging] = useState(false);
// 	const [isHover, setIsHover] = useState(false);

// 	const gridSize = useGridSize();

// 	const gridPosition = useMemo(() => {
// 		const configuration = getConfigFromApplication(applicationName);

// 		setLastGridPosition({ x: configuration.x, y: configuration.y });

// 		return [+configuration.x, +configuration.y];
// 	}, [applicationName]);

// 	const x = useMotionValue(gridPosition[0] * gridSize.width);
// 	const y = useMotionValue(gridPosition[1] * gridSize.height + yOffset);
// 	const xBlur = useMotionValue(gridPosition[0] * gridSize.width);
// 	const yBlur = useMotionValue(gridPosition[1] * gridSize.height + yOffset);

// 	const resetPosition = useCallback(() => {
// 		x.set(lastGridPosition.x * gridSize.width);
// 		y.set(lastGridPosition.y * gridSize.height + yOffset);
		
// 		xBlur.set(lastGridPosition.x * gridSize.width);
// 		yBlur.set(lastGridPosition.y * gridSize.height + yOffset);
// 		setIsFree(true);
// 	}, [x, y, gridSize, xBlur, yBlur, lastGridPosition]);

// 	const updatePosition = useCallback(
// 		(gridX: number, gridY: number) => {
// 			x.set(gridX * gridSize.width);
// 			y.set(gridY * gridSize.height + yOffset);
// 			xBlur.set(gridX * gridSize.width);
// 			yBlur.set(gridY * gridSize.height + yOffset);

// 			setLastGridPosition({ x: gridX, y: gridY });

// 			const currentConfiguration = getConfigFromApplication(applicationName);
// 			const newConfiguration = new ApplicationConfig({
// 				x: String(gridX),
// 				y: String(gridY),
// 				defaultExecName: currentConfiguration.defaultExecName
// 			});

// 			filesystem.writeFile(
// 				`/usr/applications/${applicationName}`,
// 				newConfiguration.stringify()
// 			);
// 		},
// 		[x, y, xBlur, yBlur, gridSize, applicationName]
// 	);

// 	const onDrag = useCallback(() => {
// 		const { x: newX, y: newY } = positionToGridPosition([x.get(), y.get()]);

// 		xBlur.set(newX * gridSize.width);
// 		yBlur.set(newY * gridSize.height + yOffset);
// 	}, [gridSize, x, y, xBlur, yBlur]);

// 	const onDragStart = useCallback(() => {
// 		setIsDragging(true);
// 	}, []);

// 	const onDragEnd = useCallback(() => {
// 		setIsDragging(false);
// 		const { x: newXGrid, y: newYGrid } = positionToGridPosition([
// 			x.get(),
// 			y.get()
// 		]);

// 		const isFree = isGridPositionFree(newXGrid, newYGrid);
// 		const isInBounds = gridSize.isInBounds(newXGrid, newYGrid);

// 		if (isFree && isInBounds) {
// 			updatePosition(newXGrid, newYGrid);
// 		} else {
// 			resetPosition();
// 		}
// 	}, [
// 		x,
// 		y,
// 		gridSize.isInBounds,
// 		resetPosition,
// 		updatePosition
// 	]);

// 	const onHoverStart = useCallback(() => {
// 		setIsHover(true);
// 	}, []);

// 	const onHoverEnd = useCallback(() => {
// 		setIsHover(false);
// 	}, []);

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
