import { desktop } from "../../../constants";
import { clamp } from "lodash";

export function positionToGridPosition(position: [number, number]) {
	const clampedPosition = {
		x: clamp(position[0], 0, window.innerWidth),
		y: clamp(position[1], 0, window.innerHeight)
	};
	const x = Math.floor(clampedPosition.x / desktop.grid.width);

	const y = Math.floor(clampedPosition.y / desktop.grid.height);

	return { x, y };
}
