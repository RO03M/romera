import { incrementalId } from "../../utils/incremental-id";
import type { Node } from "../node";

export const bin: Node = {
	id: incrementalId(),
	name: "/bin",
	type: "directory",
	nodes: [
		{
			id: incrementalId(),
			type: "file",
			name: "/ls",
			content: `

		
async function main() {
	const pwd = await syscall("pwd");
	const node = await syscall("fs_fdir", pwd);

	if (!node) {
		await syscall("echo", "Error finding PWD");
		exit();
	}

	await syscall("echo", node?.nodes?.map((node) => "        " + node.name));
}`
		},
		{
			id: incrementalId(),
			type: "file",
			name: "/worker",
			content: `// worker file is responsible to test the basic syscall operations while using workers
async function main(...args) {
	const foo = await syscall(
		"std.fs.path.normalize",
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
			id: incrementalId(),
			type: "file",
			name: "/cat",
			content: `//cat command
async function main(fileName) {
	const pwd = await syscall("pwd");
	const filePath = await syscall("fs_normalized", pwd + "/" + fileName);

	const file = await syscall("fs_ffile", filePath);

	if (file !== null) {
		await syscall("echo", file.content);
	}
}`
		},
		{
			id: incrementalId(),
			type: "file",
			name: "/mkdir",
			content: `//mkdir command

async function main(dirName) {
	if (!dirName) {
		await syscall("echo", "Missing directory name");
		exit();
	}

	const pwd = await syscall("pwd");

	const { status } = await syscall("mkdir", pwd, dirName);
	
	if (!status) {
		await syscall("echo", "Cannot create directory " + dirName);
		exit();
	}
}`
		},
		{
			id: incrementalId(),
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
			id: incrementalId(),
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
			id: incrementalId(),
			type: "file",
			name: "/code",
			content: `
async function main(path) {
	if (!path) {
		exit();
	}
	
	const pwd = await syscall("pwd");

	const filePath = await syscall("fs_normalized", pwd + "/" + path);
	
	await syscall("create_proc_default_rgui", "monaco", { workingDirectory: filePath });
}`
		}
	]
};
