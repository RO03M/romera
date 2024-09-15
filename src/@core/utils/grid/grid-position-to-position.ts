import { desktop } from "../../../constants";

export function gridPositionToPosition(gridPosition: [number, number]) {
	return {
		x: gridPosition[0] * desktop.grid.width,
		y: gridPosition[1] * desktop.grid.height
	};
}
