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
			content: `const node = std.fs.findNode(context.tty.workingDirectory) ?? [];

context.tty.echo(node.nodes.map((node) => "        " + node.name));`
		},
		{
			id: incrementalId(),
			type: "file",
			name: "/cat",
			content: `//cat command

const [path] = context.args;

const filePath = std.fs.path.normalize(context.tty.workingDirectory + "/" + path);

const file = std.fs.findNode(filePath);

if (file !== null) {
context.tty.echo(file.content);
}`
		},
		{
			id: incrementalId(),
			type: "file",
			name: "/mkdir",
			content: `//mkdir command

const [dirName] = context.args;

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
}`
		},
		{
			id: incrementalId(),
			type: "file",
			name: "/sleep",
			content: `//sleep command

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
};
