import type { HydrationData } from "../types";

export const bin: HydrationData = {
	name: "/bin",
	type: "dir",
	nodes: [
		{
			type: "file",
			name: "/ls",
			content: `

		
async function main() {
	const pwd = await syscall("pwd");
	const stats = await syscall("readdir", pwd);

	if (!stats) {
		await syscall("echo", "Error finding PWD");
		exit();
	}

	await syscall("echo", stats.map((dir) => "        " + dir));
}`
		},
		{
			type: "file",
			name: "/worker",
			content: `// worker file is responsible to test the basic syscall operations while using workers
async function main(...args) {
	const foo = await syscall(
		"normalize",
		"//asd/homepage/"
	);

	await syscall("echo", "worker testing");

	await syscall("echo", "passed args: " + args.toString());

	await sleep(5000);

	const pwd = await syscall("pwd");
	await syscall("echo", "currdir: " + pwd);
	await syscall("echo", "puff, slept for 5 seconds!");
	await syscall("echo", "you are free to go now!");

	exit();
}
`
		},
		{
			type: "file",
			name: "/cat",
			content: `//cat command
async function main(fileName) {
	const cwd = await pwd();
	const filePath = await normalize(cwd + "/" + fileName);

	const stat = await fs.stat(filePath);

	if (stat !== null) {
		const content = await fs.readFile(filePath, true);
		await echo(content);
	}
}`
		},
		{
			type: "file",
			name: "/mkdir",
			content: `//mkdir command

async function main(dirName) {
	if (!dirName) {
		await syscall("echo", "Missing dir name");
		exit();
	}

	const pwd = await syscall("pwd");
	const resolvedPath = await syscall("pathFormat", pwd, dirName);
	await syscall("mkdir", resolvedPath).catch(async () => {
		await syscall("echo", "Cannot create dir " + dirName);
		exit();
	});
}`
		},
		{
			type: "file",
			name: "/touch",
			content: `//mkdir command

async function main(fileName) {
	if (!fileName) {
		await echo("Missing dir name");
		exit();
	}

	const cwd = await pwd();
	const resolvedPath = await pathFormat(cwd, fileName);
	await fs.writeFile(resolvedPath, "").catch(async () => {
		await echo("Cannot create file " + fileName);
	});
}`
		},
		{
			type: "file",
			name: "/sleep",
			content: `//sleep command
async function main(time) {
	await new Promise(async (resolve, reject) => {
		let i = 0;
		const interval = setInterval(async () => {
			i++;
			await syscall("echo", i + " seconds elapsed");
			if (i >= time) {
				resolve();
				clearInterval(interval);
			}
		}, 1000);
	});
}`
		},
		{
			type: "file",
			name: "/watch",
			content: `
async function main(...args) {
	const command = args.join(" ");

	console.log(command);
	return new Promise((res) => {
		const interval = setInterval(async () => {
			// await syscall
			const foo = await syscall("createProcess", "ls")
			console.log(foo);
		}, 1000);
	});
}`
		},
		{
			type: "file",
			name: "/code",
			content: `
async function main(path) {
	if (!path) {
		exit();
	}
	
	const pwd = await syscall("pwd");

	const filePath = await normalize(pwd + "/" + path);
	
	await processes.fork("magic-spawn", ["monaco", filePath]);
}`
		}
	]
};
