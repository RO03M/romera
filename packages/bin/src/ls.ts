import "./syscall"

export function isArrayOfStrings(value: unknown): value is string[] {
	if (!Array.isArray(value)) {
		return false;
	}

	if (value.length === 0) {
		return true;
	}

	return typeof value[0] === "string";
}

async function main() {
	const pwd = await syscall("pwd", -1);
	const stats = await syscall("readdir", pwd);
	
	if (!isArrayOfStrings(stats)) {
		await syscall("echo", "Error finding PWD");
		exit();
	}

	await syscall("echo", stats.join("\t"), -1);
}

export const ls = main;