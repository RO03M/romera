import { filesystem } from "../../../../../app";
import { getConfigFromApplication } from "./application-config-file";

export function isGridPositionFree(gridX: number, gridY: number) {
	const filenames = filesystem.readdir("/home/romera/desktop");
	for (const filename of filenames) {
		if (typeof filename !== "string") {
			continue;
		}

		const configuration = getConfigFromApplication(filename);

		if (configuration.x === gridX && configuration.y === gridY) {
			return false;
		}
	}

	return true;
}