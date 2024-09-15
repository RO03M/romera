import { desktop } from "../../../constants";

export function positionToGridPosition(position: [number, number]) {
	return {
		x: Math.floor(position[0] / desktop.grid.width),
		y: Math.floor(position[1] / desktop.grid.height)
	};
}
