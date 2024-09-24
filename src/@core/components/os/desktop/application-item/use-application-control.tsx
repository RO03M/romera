import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { useFile } from "../../../../filesystem/hooks/use-file";
import { useGridSize } from "../../../../hooks/use-grid-size";
import { type HTMLMotionProps, useMotionValue } from "framer-motion";
import { positionToGridPosition } from "../../../../utils/grid";
import { useApplicationsConfigFileManager } from "./use-applications-config-file-manager";

export function useApplicationControl(applicationName: string) {
	const { isPositionFree } = useApplicationsConfigFileManager();

	const { file, writeFile } = useFile(`/usr/applications/${applicationName}`, {
		forceCreation: true
	});

	const [isFree, setIsFree] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [isHover, setIsHover] = useState(false);

	const gridSize = useGridSize();

	const gridPosition = useMemo(() => {
		if (file?.content === undefined || !/^\d+,\d+$/.test(file.content)) {
			return [0, 0];
		}

		return file.content.split(",").map((pos) => +pos);
	}, [file?.content]);

	const x = useMotionValue(gridPosition[0] * gridSize.width);
	const y = useMotionValue(gridPosition[1] * gridSize.height);
	const xBlur = useMotionValue(gridPosition[0] * gridSize.width);
	const yBlur = useMotionValue(gridPosition[1] * gridSize.height);

	const resetPosition = useCallback(() => {
		xBlur.set(gridPosition[0] * gridSize.width);
		yBlur.set(gridPosition[1] * gridSize.height);
		setIsFree(true);
	}, [gridSize, xBlur, yBlur, gridPosition]);

	const onDrag = useCallback(() => {
		const { x: newX, y: newY } = positionToGridPosition([x.get(), y.get()]);

		setIsFree(isPositionFree(newX, newY, applicationName));
		xBlur.set(newX * gridSize.width);
		yBlur.set(newY * gridSize.height);
	}, [applicationName, gridSize, x, y, xBlur, yBlur, isPositionFree]);

	const onDragStart = useCallback(() => {
		setIsDragging(true);
	}, []);

	const onDragEnd = useCallback(() => {
		setIsDragging(false);
		const { x: newX, y: newY } = positionToGridPosition([x.get(), y.get()]);

		const isFree = isPositionFree(newX, newY, applicationName);

		if (isFree) {
			writeFile(`${newX},${newY}`);
		} else {
			resetPosition();
		}
	}, [applicationName, x, y, resetPosition, writeFile, isPositionFree]);

	const onHoverStart = useCallback(() => {
		setIsHover(true);
	}, []);

	const onHoverEnd = useCallback(() => {
		setIsHover(false);
	}, []);

	useEffect(() => {
		x.set(gridPosition[0] * gridSize.width);
		y.set(gridPosition[1] * gridSize.height);
	}, [gridPosition, x, y, gridSize]);

	useEffect(() => {
		if (file !== null && file.content === undefined) {
			writeFile("0,0");
		}
	}, [file, writeFile]);

	return {
		itemComponentProps: {
			onDrag,
			onDragStart,
			onDragEnd,
			onHoverStart,
			onHoverEnd
		} as HTMLMotionProps<"div">,
		item: {
			position: {
				x,
				y
			}
		},
		blur: {
			position: {
				x: xBlur,
				y: yBlur
			},
			show: isDragging || isHover,
			isFree,
			isDragging,
			isHover
		}
	};
}
