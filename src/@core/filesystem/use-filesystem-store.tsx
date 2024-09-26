import { create } from "zustand";
import type { Node } from "./node";
import { incrementalId } from "../utils/incremental-id";
import { Terminal } from "../components/os/terminal/terminal";

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
const node = std.fs.findNode(context.bashContext.path) ?? [];

return node.nodes.map((node) => "        " + node.name);
						`
					},
					{
						id: incrementalId(),
						type: "file",
						name: "/cat",
						content: `
const [path] = context.args;

const filePath = std.fs.path.normalize(context.bashContext.path + "/" + path);

const file = std.fs.findNode(filePath);

if (file !== null) {
	return file.content;
}


return "";
						`
					},
					{
						id: incrementalId(),
						type: "file",
						name: "/mkdir",
						content: `
const [dirName] = context.args;

if (!dirName) {
	return "Missing directory name"
}

const newDirectory = {
	name: dirName,
	type: "directory"
};

const { status } = std.fs.createNode(context.bashContext.path, newDirectory);

if (!status) {
	return "Cannot create directory " + dirName;
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
		context.tty.echo(i + "seconds elapsed");
		if (i >= sleepTime) {
			resolve();
			clearInterval(interval);
		}
	}, 1000);
});
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
										name: "/hello",
										type: "file",
										content: "Hello world!"
									},
									{
										id: incrementalId(),
										name: "/file2",
										type: "file",
										content: "Hello world!"
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
						nodes: []
					}
				]
			}
		]
	}
}));
