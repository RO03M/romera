import { Terminal } from "@xterm/xterm";
import { normalize } from "../../../filesystem/utils/path";
import { filesystem, processScheduler } from "../../../../app";
import { formatInput } from "./utils/format-input";

enum TerminalSequences {
	NULL = "\0",
	ARROW_UP = "\x1b[A",
	ARROW_DOWN = "\x1b[B",
	ARROW_RIGHT = "\x1b[C",
	ARROW_LEFT = "\x1b[D"
}

export class Bash extends Terminal {
	public username = "romera";
	public hostname = "app";
	public workingDirectory = "/home/romera";

	public userInput = "";

	constructor(anchor: HTMLElement) {
		super({
			cursorBlink: true,
			tabStopWidth: 4
		});
		this.open(anchor);
		this.prompt();
		this.onKey(({ key, domEvent }) => {
			const code = key.charCodeAt(0);
			console.log(key, code);

			if (code === 13) {
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
	}

	private submit() {
		// TODO move format input to bash class
		const { program, args } = formatInput(this.userInput);
		console.log(program, args);
		switch (program) {
			case "cd":
				this.cd(args[0]);
				break;
			default:
				processScheduler.exec(program, args, {
					cwd: this.workingDirectory,
					tty: 1
				});
				break;
		}
		this.userInput = "";
	}

	public moveCursorXBy(value: number) {
		if (value === 0) {
			return;
		}

		const sequence = value > 0 ? `\x1b[${value}C` : `\x1b[${value * -1}D`;

		this.write(sequence);
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

			this.prompt();
			return;
		}

		this.writeln(`Terminal: cd: ${path} no such directory`);
		this.prompt();
	}

	public prompt() {
		this.write("\r\n");
		this.write(this.promptMessage);
		this.moveCursorXBy(1);
	}

	private get promptMessage() {
		return `\x1b[32m${this.username}@${this.hostname}\x1b[m:\x1b[34m${this.workingDirectory}\x1b[m$`;
	}

	private get promptMessageSize() {
		return `${this.username}@${this.hostname}:${this.workingDirectory}$`.length;
	}
}
