import { Terminal } from "@xterm/xterm";
import { normalize } from "../../../filesystem/utils/path";
import { filesystem, processScheduler, terminalManager } from "../../../../app";
import { formatInput } from "./utils/format-input";
import { incrementalId } from "../../../utils/incremental-id";
import { FitAddon } from "@xterm/addon-fit";

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
		const fitAddon = new FitAddon();
		this.loadAddon(fitAddon);
		this.id = incrementalId("tty");
		this.open(anchor);
		this.write(`tty: ${this.id.toString()}`);
		this.prompt();
		this.onKey(({ key, domEvent }) => {
			console.log(this.buffer.normal.baseY);
			const code = key.charCodeAt(0);
			// console.log(key, code);

			if (code === 13) {
				console.log("enter");
				this.submit();
				return;
			}

			if (code === 127) {
				this.backspace();
				return;
			}

			switch (key) {
				case TerminalSequences.ESC:
					this.write("\x1b[1;1H");
					return;
				case TerminalSequences.ARROW_LEFT:
					this.onArrowLeft();
					return;
				case TerminalSequences.ARROW_RIGHT:
					this.onArrowRight();
					return;
			}
			this.write(key);
			this.userInput += key;
		});

		fitAddon.fit(); //Should be called inside a resize event handler

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

	private backspace() {
		// console.log(this.inputCursorX);
		// console.log(this.userInput.slice())
		const sliceInput = this.userInput.slice(0, this.inputCursorX);
		const backwardsCount = sliceInput.match(/\s([\w]+)$/)?.index ?? this.inputCursorX;
		console.log(backwardsCount, sliceInput.match(/\s([\w]+)$/));

		if (this.inputCursorX <= 0) {
			return;
		}

		this.write(`\x1b[${backwardsCount}D`);
		this.write(`\x1b[${backwardsCount}P`);
		this.userInput = this.userInput.slice(0, this.inputCursorX) + this.userInput.slice(this.inputCursorX + backwardsCount);
	}

	private onArrowLeft() {
		if (this.inputCursorX > 0) {
			this.moveCursorXBy(-1);
		}
	}

	private onArrowRight() {
		if (this.inputCursorX < this.userInput.length) {
			this.moveCursorXBy(1);
		}
	}

	private get inputCursorX() {
		return this.buffer.normal.cursorX - 1 - this.promptMessageSize;
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
