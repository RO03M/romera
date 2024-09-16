import { create } from "zustand";
import type { Node } from "./node";

interface FileSystemState {
	node: Node;
}

export const useFilesystemStore = create<FileSystemState>()((set) => ({
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
							const foda = 10 + 10;
							console.log(foda, system);
						`
					},
					{
						id: 4,
						type: "file",
						name: "/cat",
						content: `
							const file = std.fs.findNode("/home/hello");

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
					}
				]
			}
		]
	}
}));
