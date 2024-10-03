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

export function splitPath(filepath: string) {
	const normalized = normalize(filepath);
	if (normalized === "/") {
		return ["/"];
	}

	return normalized.split("/").map((part) => `/${part}`);
}

export function format(options: { root: string, base: string }) {
	const { root, base } = options;

	// base is an absolute path
	if (base.startsWith("/")) {
		return normalize(base);
	}

	return normalize(`${root}/${base}`);
}

export function dirname(filepath: string) {
	return normalize(filepath.split("/").slice(0, -1).join("/"));
}

export function basename(filepath: string) {
	return normalize(filepath.split("/").slice(-1).join("/"));
}

export function splitParentPathAndNodeName(path: string) {
	const dir = dirname(path);
	const base = basename(path);

	return [dir, base];
}