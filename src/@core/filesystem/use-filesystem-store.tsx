import { create } from "zustand";
import type { Node } from "./node";
import { incrementalId } from "../utils/incremental-id";

interface FileSystemState {
	node: Node;
	setNode: (node: Node) => void;
}

export const useFilesystemStore = create<FileSystemState>()((set) => ({
	setNode(node) {
		set({ node });
	},
	node: {
		id: incrementalId(),
		name: "/",
		type: "directory",
		nodes: [
			{
				id: incrementalId(),
				name: "/bin",
				type: "directory",
				nodes: [
					{
						id: incrementalId(),
						type: "file",
						name: "/ls",
						content: `
const node = std.fs.findNode(context.tty.workingDirectory) ?? [];

context.tty.echo(node.nodes.map((node) => "        " + node.name));
						`
					},
					{
						id: incrementalId(),
						type: "file",
						name: "/cat",
						content: `
const [path] = context.args;

const filePath = std.fs.path.normalize(context.tty.workingDirectory + "/" + path);

const file = std.fs.findNode(filePath);

if (file !== null) {
	context.tty.echo(file.content);
}
						`
					},
					{
						id: incrementalId(),
						type: "file",
						name: "/mkdir",
						content: `
const [dirName] = context.args;
console.log(dirName);
if (!dirName) {
	context.tty.echo("Missing directory name");
}

const newDirectory = {
	name: dirName,
	type: "directory"
};

const { status } = std.fs.createNode(context.tty.workingDirectory, newDirectory);

if (!status) {
	context.tty.echo("Cannot create directory " + dirName);
}
						`
					},
					{
						id: incrementalId(),
						type: "file",
						name: "/sleep",
						content: `
const [sleepTime = 1] = context.args;
return new Promise((resolve, reject) => {
	let i = 0;
	const interval = setInterval(() => {
		i++;
		context.tty.echo(i + " seconds elapsed");
		if (i >= sleepTime) {
			resolve();
			clearInterval(interval);
		}
	}, 1000);
});
						`
					},
					{
						id: incrementalId(),
						type: "file",
						name: "/watch",
						content: `
const command = context.args.join(" ");
const interval = setInterval(() => {
	std.processes.createProcess(command, context.tty);
}, 1000);
						`
					},
					{
						id: incrementalId(),
						type: "file",
						name: "/code",
						content: `
const [path] = context.args;

const filePath = std.fs.path.normalize(context.tty.workingDirectory + "/" + path);

std.processes.createWindowProcessFromProgramTable("monaco", { workingDirectory: filePath });
						`
					}
				]
			},
			{
				id: incrementalId(),
				name: "/home",
				type: "directory",
				nodes: [
					{
						id: incrementalId(),
						name: "/hello",
						type: "file",
						content: "Hello world!"
					},
					{
						id: incrementalId(),
						name: "/romera",
						type: "directory",
						nodes: [
							{
								id: incrementalId(),
								name: "/desktop",
								type: "directory",
								nodes: [
									{
										id: incrementalId(),
										name: "/jsfile.js",
										type: "file",
										content: "const fuck = false;"
									},
									{
										id: incrementalId(),
										name: "/file2",
										type: "file",
										content: "Hello world!"
									},
									{
										id: incrementalId(),
										name: "/folder",
										type: "directory"
									}
								]
							}
						]
					}
				]
			},
			{
				id: incrementalId(),
				name: "/usr",
				type: "directory",
				nodes: [
					{
						id: incrementalId(),
						name: "/applications",
						type: "directory",
						nodes: [
							{
								id: incrementalId(),
								name: "/jsfile.js",
								type: "file",
								content: '[Desktop Entry];\nx=0;\ny=0;\ndefaultExecName=terminal'
							},
							{
								id: incrementalId(),
								name: "/file2",
								type: "file",
								content: '[Desktop Entry];\nx=0;\ny=1;'
							},
							{
								id: incrementalId(),
								name: "/folder",
								type: "file",
								content: '[Desktop Entry];\nx=0;\ny=2;'
							}
						]
					}
				]
			}
		]
	}
}));
