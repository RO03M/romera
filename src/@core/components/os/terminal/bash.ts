import { Terminal } from "@xterm/xterm";

export class Bash extends Terminal {
    public username = "romera";
    public hostname = "app";
    public workingDirectory = "/home/romera";

	constructor(anchor: HTMLElement) {
		super({
			cursorBlink: true,
			tabStopWidth: 4
		});
		this.open(anchor);
        this.prompt();
		this.onKey(({ key, domEvent }) => {
			const code = key.charCodeAt(0);
			console.log(code, key.charAt(0), key, this.buffer.normal.cursorX);
			if (code === 13) {
				this.write("\r\n");
				this.prompt();
				this.moveCursor(2);
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
			this.write(key);
		});
	}

    public moveCursor(value: number) {
        if (value === 0) {
            return;
        }

        const sequence = value > 0 ? "\x1b[C" : "\x1b[D";

        this.write(sequence);
    }
    
    private prompt() {
        // this.write("\x1b[1;32romera@m");
        // this.write("romera@m");
        this.write(this.promptMessage);
    }

    private get promptMessage() {
        return `\x1b[32m${this.username}@${this.hostname}\x1b[m:\x1b[34m${this.workingDirectory}\x1b[m$`;
    }

    private get promptMessageSize() {
        return `${this.username}@${this.hostname}:${this.workingDirectory}$`.length;
    }
}
