import { useMemo } from "preact/hooks";
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

	return {
		width: gridWidth,
		height: gridHeight,
	};
}
