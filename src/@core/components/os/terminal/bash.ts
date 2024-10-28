import { Terminal } from "@xterm/xterm";
import { normalize } from "../../../filesystem/utils/path";
import { filesystem, processScheduler, terminalManager } from "../../../../app";
import { formatInput } from "./utils/format-input";
import { incrementalId } from "../../../utils/incremental-id";
import { FitAddon } from "@xterm/addon-fit";
import {
	getRowColIndexFromCursor,
	rowCountFromText,
	rowCountFromTextSize
} from "./utils/get-row-col-from-text";
import { clamp } from "../../../utils/math";

enum TerminalSequences {
	NULL = "\0",
	ESC = "\x1B",
	ARROW_UP = "\x1b[A",
	ARROW_DOWN = "\x1b[B",
	ARROW_RIGHT = "\x1b[C",
	ARROW_LEFT = "\x1b[D",
	END = "\x1b[F",
	HOME = "\x1b[H"
}

enum KeyCodes {
	BACKSPACE = 127,
	SPACE = 32,
	ENTER = 13
}

export class Bash extends Terminal {
	public readonly id;
	public username = "romera";
	public hostname = "app";
	public workingDirectory = "/home/romera";

	private userInput = "";
	private cursor = 0;

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
		this.onData((data) => {
			const code = data.charCodeAt(0);
			console.log(code);
			if (code < 32) {
				switch (data) {
					case TerminalSequences.HOME:
						this.setCursor(0);
						break;
					case TerminalSequences.END:
						this.setCursor(this.userInput.length);
						break;
					case TerminalSequences.ESC:
						// this.setCursor(this.cursor + 2);
						this.clearInput();
						break;
					case TerminalSequences.ARROW_LEFT:
						this.setCursor(this.cursor - 1);
						return;
					case TerminalSequences.ARROW_RIGHT:
						this.setCursor(this.cursor + 1);
						return;
				}

				switch (code) {
					case KeyCodes.ENTER:
						this.submit();
						break;
				}

				return;
			}

			switch (code) {
				case KeyCodes.BACKSPACE:
					this.eraseAtCursor();
					break;
				default:
					this.insertStringAtCursor(data);
					break;
			}
		});

		fitAddon.fit(); //Should be called inside a resize event handler
		terminalManager.terminals.set(this.id, this);
	}

	public dispose(): void {
		super.dispose();
		terminalManager.terminals.delete(this.id);
	}

	private insertStringAtCursor(data: string) {
		const input =
			this.userInput.substring(0, this.cursor) +
			data +
			this.userInput.substring(this.cursor);
		this.cursor += data.length;
		this.setInput(input);
	}

	private eraseAtCursor() {
		const input =
			this.userInput.substring(0, this.cursor - 1) +
			this.userInput.substring(this.cursor);
		if (this.cursor > 0) {
			this.cursor -= 1;
		}
		this.setInput(input);
	}

	private setInput(input: string) {
		this.userInput = input;
		this.clearInput();
		this.write(this.withPrompt(input));

		const totalRows = rowCountFromTextSize(this.promptLength + this.userInput.length, this.cols);
		const { row, column } = getRowColIndexFromCursor(
			this.promptLength + this.cursor,
			this.cols
		);

		this.write("\r");
		for (let i = 0; i < totalRows - row - 1; i++) {
			this.write("\x1b[F");
		}
		for (let i = 0; i < column + 1; i++) {
			this.write("\x1b[C");
		}
	}

	/**
	 * Clears the current input buffer from the screen
	 */
	private clearInput() {
		const totalRows = rowCountFromTextSize(
			this.promptLength + this.userInput.length,
			this.cols
		);
		const { row: currentRow, column } = getRowColIndexFromCursor(
			this.promptLength + this.cursor,
			this.cols
		);

		for (let i = currentRow; i < totalRows - 1; i++) {
			this.write("\x1b[E");
		}

		this.write("\r\x1b[K");
		for (let currRow = 1; currRow < totalRows; currRow++) {
			this.write("\x1b[M\x1b[F");
		}
	}

	private withPrompt(string: string) {
		return `\x1b[32m${this.username}@${this.hostname}\x1b[m:\x1b[34m${this.workingDirectory}\x1b[m$ ${string}`;
	}

	private setCursor(newCursor: number) {
		const clamppedCursor = clamp(newCursor, 0, this.userInput.length);

		const { row: currentRow, column: currentColumn } = getRowColIndexFromCursor(
			this.promptLength + this.cursor,
			this.cols
		);
		const { row: newRow, column: newColumn } = getRowColIndexFromCursor(
			this.promptLength + clamppedCursor,
			this.cols
		);

		const verticalKey = currentRow > newRow ? "\x1b[A" : "\x1b[B";
		const horizontalKey = currentColumn > newColumn ? "\x1b[D" : "\x1b[C";

		for (let i = 0; i < Math.abs(currentRow - newRow); i++) {
			console.log("vmove");
			this.write(verticalKey);
		}

		for (let i = 0; i < Math.abs(currentColumn - newColumn); i++) {
			console.log("hmove");
			this.write(horizontalKey);
		}

		this.cursor = clamppedCursor;
		console.log(this.cursor);
	}

	private submit() {
		console.log(this.userInput);
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

		this.cursor = 0;
		this.userInput = "";
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
	}

	private get promptMessage() {
		return `\x1b[32m${this.username}@${this.hostname}\x1b[m:\x1b[34m${this.workingDirectory}\x1b[m$ `;
	}

	private get promptLength() {
		return `${this.username}@${this.hostname}:${this.workingDirectory}$`.length;
	}
}
