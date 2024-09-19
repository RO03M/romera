import { create } from "zustand";
import type { Node } from "./node";

interface FileSystemState {
	node: Node;
}

export const useFilesystemStore = create<FileSystemState>()(() => ({
	node: {
		id: 1,
		name: "/",
		type: "directory",
		nodes: [
			{
				id: 2,
				name: "/bin",
				type: "directory",
				nodes: [
					{
						id: 3,
						type: "file",
						name: "/ls",
						content: `
const node = std.fs.findNode(context.bashContext.path) ?? [];

return node.nodes.map((node) => "        " + node.name);
						`
					},
					{
						id: 4,
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
					}
				]
			},
			{
				id: 5,
				name: "/home",
				type: "directory",
				nodes: [
					{
						id: 6,
						name: "/hello",
						type: "file",
						content: "Hello world!"
					},
					{
						id: 7,
						name: "/romera",
						type: "directory",
						nodes: [
							{
								id: 8,
								name: "/desktop",
								type: "directory"
							}
						]
					}
				]
			}
		]
	}
}));
