import { Terminal } from "@xterm/xterm";
import { normalize } from "@romos/fs";
import { filesystem } from "../../../../app";
import { formatInput } from "./utils/format-input";
import { incrementalId } from "../../../utils/incremental-id";
import { FitAddon } from "@xterm/addon-fit";
import {
	getRowColIndexFromCursor,
	rowCountFromTextSize
} from "./utils/get-row-col-from-text";
import { clamp } from "../../../utils/math";
import { HistoryController } from "./history-controller";
import { Kernel, Process } from "@romos/kernel";
import { ShellParser } from "./utils/shell-parser";

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
	private fitAddon = new FitAddon();
	private historyController = new HistoryController();

	constructor(anchor: HTMLElement) {
		super({
			cursorBlink: true,
			tabStopWidth: 4
		});
		this.loadAddon(this.fitAddon);
		this.id = incrementalId("tty");
		this.open(anchor);
		this.write(`tty: ${this.id.toString()}`);
		this.prompt();
		this.onData((data) => {
			const code = data.charCodeAt(0);
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
					case TerminalSequences.ARROW_UP:

						this.setInput(this.historyController.current());
						this.historyController.next()
						return;
					case TerminalSequences.ARROW_DOWN:
						this.setInput(this.historyController.current());
						this.historyController.previous()
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

		// fitAddon.fit(); //Should be called inside a resize event handler
		Kernel.instance().ttyManager.terminals.set(this.id, this);
	}

	public dispose(): void {
		super.dispose();
		Kernel.instance().ttyManager.terminals.delete(this.id);
	}

	public fit() {
		this.fitAddon.fit();
		this.setInput(this.userInput)
	}

	private insertStringAtCursor(data: string) {
		const input =
			this.userInput.substring(0, this.cursor) +
			data +
			this.userInput.substring(this.cursor);
		this.setInput(input, true, 1);
		this.cursor += data.length;
	}

	private eraseAtCursor() {
		if (this.cursor <= 0) {
			return;
		}

		const input =
			this.userInput.substring(0, this.cursor - 1) +
			this.userInput.substring(this.cursor);
		this.clearInput();
		this.cursor -= 1;
		this.setInput(input, false);
	}

	private setInput(input: string, clearInput = true, moveXOffset = 0) {
		if (clearInput) {
			// Clearing the old input, must call it before assigning a new value to the userInput field
			this.clearInput();
		}

		this.userInput = input;
		this.write(this.withPrompt(input));

		const totalRows = rowCountFromTextSize(
			this.promptLength + this.userInput.length,
			this.cols
		);
		const { row, column } = getRowColIndexFromCursor(
			this.promptLength + this.cursor,
			this.cols
		);

		this.write("\r");
		for (let i = 0; i < totalRows - row - 1; i++) {
			this.write("\x1b[F");
		}

		for (let i = 0; i < column + moveXOffset; i++) {
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
		const { row: currentRow } = getRowColIndexFromCursor(
			this.promptLength + this.cursor,
			this.cols
		);

		// Go all the way down, to the last row of the current input buffer
		for (let i = currentRow; i < totalRows - 1; i++) {
			this.write("\x1b[E");
		}

		// Delete the entire row [M and move up and to the home [F
		for (let currRow = 0; currRow < totalRows; currRow++) {
			this.write("\x1b[M\x1b[F");
		}
		this.write("\x1b[E");
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
			this.write(verticalKey);
		}

		for (let i = 0; i < Math.abs(currentColumn - newColumn); i++) {
			this.write(horizontalKey);
		}

		this.cursor = clamppedCursor;
	}

	private goToBufferLastLine() {
		const totalRows = rowCountFromTextSize(
			this.promptLength + this.userInput.length,
			this.cols
		);

		const { row: currentRow } = getRowColIndexFromCursor(
			this.promptLength + this.cursor,
			this.cols
		);

		// Go all the way down, to the last row of the current input buffer
		for (let i = currentRow; i < totalRows - 1; i++) {
			this.write("\x1b[E");
		}
	}

	private submit() {
		this.historyController.add(this.userInput);
		this.historyController.resetIndex();
		// TODO move format input to bash class
		const { program, args } = formatInput(this.userInput);

		this.goToBufferLastLine();

		const sh = new ShellParser();
		sh.parse(this.userInput);

		console.log(sh);
		
		switch (sh.firstProgram()) {
			case "cd":
				this.cd(args[0]);
				this.prompt();
				break;
			case "echo":
				this.echo(...args);
				this.prompt();
				break;
			default: {
				if (sh.output?.type === "command") {
					const process = Kernel.instance().scheduler.exec(program, args, {
						cwd: this.workingDirectory,
						tty: this.id
					});
					
					console.log(process);
	
					process.stdout.on("data", (data) => {
						if (data === null) {
							return;
						}
	
						this.echo(data);
					});
	
					Kernel.instance().scheduler.waitpid(process.pid).then(() => {
						this.prompt();
					});
				} else if (sh.output?.type === "pipeline") {
					const processes: Process[] = [];
					let currentProcess: Process | undefined;
					let prevProcess: Process | undefined;
					for (const command of sh.output.commands) {
						currentProcess = Kernel.instance().scheduler.exec(command.program, command.args, {
							cwd: this.workingDirectory,
							tty: this.id
						});

						processes.push(currentProcess);

						if (prevProcess) {
							prevProcess.stdout.pipe(currentProcess.stdin);
						}

						prevProcess = currentProcess;
					}

					// In this point the currentProcess is the last one created
					if (currentProcess) {
						currentProcess.stdout.on("data", (data) => {
							if (data === null) {
								return;
							}

							this.echo(data);
						});

						Kernel.instance().scheduler.waitpid(currentProcess.pid).then(() => {
							this.prompt();
						});
					} else {
						this.prompt();
					}
				}

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
		
		if (!stat) {
			this.echo(`bash: cd: ${path} no such directory`);

			return;
		}
		
		if (stat.type === "file") {
			this.echo(`bash: cd: ${path}: Not a directory`);
			return;
		}

		this.workingDirectory = absolutePath;
	}

	public prompt() {
		this.echo(this.promptMessage);
	}

	private get promptMessage() {
		return `\x1b[32m${this.username}@${this.hostname}\x1b[m:\x1b[34m${this.workingDirectory}\x1b[m$ `;
	}

	private get promptLength() {
		return `${this.username}@${this.hostname}:${this.workingDirectory}$ `
			.length;
	}
}
