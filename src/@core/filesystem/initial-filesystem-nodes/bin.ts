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
	const pwd = await syscall("pwd");
	const filePath = await syscall("fs_normalized", pwd + "/" + fileName);

	const stat = await syscall("stat", filePath);

	if (stat !== null) {
		const content = await syscall("readFile", filePath, { decode: true });
		await syscall("echo", content);
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

	return new Promise((res) => {
		const interval = setInterval(() => {
			// await syscall
			// std.processes.createProcess(command, context.tty);
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

	const filePath = await syscall("fs_normalized", pwd + "/" + path);
	
	await syscall("create_proc_default_rgui", "monaco", { workingdir: filePath });
}`
		}
	]
};
