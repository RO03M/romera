export function useApplicationItemActions() {
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
}