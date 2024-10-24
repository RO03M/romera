import { Terminal } from "@xterm/xterm";
import { normalize } from "../../../filesystem/utils/path";
import { filesystem, processScheduler, terminalManager } from "../../../../app";
import { formatInput } from "./utils/format-input";
import { incrementalId } from "../../../utils/incremental-id";

enum TerminalSequences {
	NULL = "\0",
	ESC = "\x1B",
	ARROW_UP = "\x1b[A",
	ARROW_DOWN = "\x1b[B",
	ARROW_RIGHT = "\x1b[C",
	ARROW_LEFT = "\x1b[D"
}

export class Bash extends Terminal {
	public readonly id;
	public username = "romera";
	public hostname = "app";
	public workingDirectory = "/home/romera";

	public userInput = "";

	constructor(anchor: HTMLElement) {
		super({
			cursorBlink: true,
			tabStopWidth: 4
		});
		this.id = incrementalId("tty");
		this.open(anchor);
		this.write(`tty: ${this.id.toString()}`);
		this.prompt();
		this.onKey(({ key, domEvent }) => {
			const code = key.charCodeAt(0);
			// console.log(key, code);

			if (code === 13) {
				console.log("enter");
				this.submit();
				return;
			}

			if (code === 127) {
				if (this.buffer.normal.cursorX <= this.promptMessageSize) {
					return;
				}

				this.write("\x1b[D");
				this.write("\x1b[P");
				return;
			}

			switch (key) {
				case TerminalSequences.ESC:
					this.write("\x1b[1;1H");
					return;
				case TerminalSequences.ARROW_LEFT:
					if (this.buffer.normal.cursorX - 1 > this.promptMessageSize) {
						this.moveCursorXBy(-1);
					}
					return;
				case TerminalSequences.ARROW_RIGHT:
					if (this.buffer.normal.cursorX + 1 > this.promptMessageSize) {
						this.moveCursorXBy(1);
					}
					return;
			}
			this.write(key);
			this.userInput += key;
		});

		terminalManager.terminals.set(this.id, this);
	}

	private submit() {
		// TODO move format input to bash class
		const { program, args } = formatInput(this.userInput);

		switch (program) {
			case "cd":
				this.cd(args[0]);
				this.prompt();
				break;
			case "echo":
				this.echo(...args);
				this.prompt();
				break;
			default: {
				const process = processScheduler.exec(program, args, {
					cwd: this.workingDirectory,
					tty: this.id
				});

				processScheduler.waitpid(process.pid).then((pid) => {
					this.prompt();
				});
				break;
			}
		}

		this.userInput = "";
	}

	public dispose(): void {
		super.dispose();
		terminalManager.terminals.delete(this.id);
	}

	public moveCursorXBy(value: number) {
		if (value === 0) {
			return;
		}

		const sequence = value > 0 ? `\x1b[${value}C` : `\x1b[${value * -1}D`;

		this.write(sequence);
	}

	public echo(...args: string[]) {
		this.write("\r\n");
		this.write(args.join(" "));
	}

	public cd(path: string) {
		let absolutePath = "";
		// find from root of filesystem
		if (path.startsWith("/")) {
			absolutePath = normalize(path);
		} else {
			absolutePath = normalize(`${this.workingDirectory}/${path}`);
		}

		const stat = filesystem.stat(absolutePath);

		if (stat) {
			this.workingDirectory = absolutePath;

			return;
		}

		this.echo(`Terminal: cd: ${path} no such directory`);
	}

	public prompt() {
		console.trace();
		this.echo(this.promptMessage);
		this.moveCursorXBy(1);
	}

	private get promptMessage() {
		return `\x1b[32m${this.username}@${this.hostname}\x1b[m:\x1b[34m${this.workingDirectory}\x1b[m$`;
	}

	private get promptMessageSize() {
		return `${this.username}@${this.hostname}:${this.workingDirectory}$`.length;
	}
}
