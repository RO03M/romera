const path = require("node:path");

export function makeAbsolutePath(inputPath: string, relativePath = "/") {
	const splittedPath = inputPath
		.split(/(?=[\/])|(?<=[\/])/g)
		.map((nodePath) => `/${nodePath}`.replace("//", "/"));

	if (inputPath.startsWith("/")) {
		return "";
	}

	return normalize(`${relativePath}/${inputPath}`);
}
