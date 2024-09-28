export function normalize(path: string) {
	let formattedPath = path.replace(/\/$/, "").replace(/\/+/g, "/");

	let splittedPath = formattedPath.split("/");

	while (splittedPath.includes("..") || splittedPath.includes(".")) {
		const tempFormattedPath: (string | null)[] = splittedPath;

		for (let i = 0; i < tempFormattedPath.length; i++) {			
			if (tempFormattedPath[i] === "..") {
				tempFormattedPath[i] = null;
				if (i - 1 >= 0) {
					tempFormattedPath[i - 1] = null;
				}
				break;
			}

			if (tempFormattedPath[i] === ".") {
				tempFormattedPath[i] = null;
				break;
			}
		}

		splittedPath = tempFormattedPath.filter((path) => path !== null);
	}

	if (splittedPath.length === 0) {
		return "/";
	}

	splittedPath.push("");
	formattedPath = splittedPath.join("/");
	if (formattedPath.length > 1) {
		formattedPath = formattedPath.replace(/\/$/, "");
	}

	if (!formattedPath.startsWith("/")) {
		formattedPath = `/${formattedPath}`;
	}

	return formattedPath;
}

export function splitParentPathAndNodeName(path: string) {
	const parentPath = normalize(path.split("/").slice(0, -1).join("/"));
	const nodeName = normalize(path.split("/").slice(-1).join("/"));

	return [parentPath, nodeName];
}