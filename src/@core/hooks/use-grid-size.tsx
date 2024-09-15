import { useCallback, useMemo } from "preact/hooks";
import { useWindowSize } from "./use-window-size";
import { desktop } from "../../constants";

export function useGridSize() {
	const { width: windowWidth, height: windowHeight } = useWindowSize();

	const gridWidth = useMemo(() => {
		return windowWidth / Math.floor(windowWidth / desktop.grid.width);
	}, [windowWidth]);

	const gridHeight = useMemo(() => {
		return windowHeight / Math.floor(windowHeight / desktop.grid.height);
	}, [windowHeight]);

	const positionToGridPosition = useCallback(
		(position: [number, number]) => ({
			x: Math.round(position[0] / gridWidth),
			y: Math.round(position[1] / gridHeight)
		}),
		[gridWidth, gridHeight]
	);

	return {
		width: gridWidth,
		height: gridHeight,
		positionToGridPosition
	};
}
