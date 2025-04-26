import "../syscall"

async function main() {
	function isArrayOfStrings(value: unknown): value is string[] {
		if (!Array.isArray(value)) {
			return false;
		}
	
		if (value.length === 0) {
			return true;
		}
	
		return typeof value[0] === "string";
	}

	const pwd = await syscall("pwd", proc.pid);

	const stats = await syscall("readdir", pwd);

	if (!isArrayOfStrings(stats)) {
		await syscall("echo", "Error finding PWD");
		exit();
	}

	await syscall("echo", stats.join("\t"), proc.tty);
}

export const ls = main;