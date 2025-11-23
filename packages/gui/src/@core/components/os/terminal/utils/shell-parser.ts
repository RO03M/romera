interface Command {
    program: string;
    args: string[];
}

interface Output {
    type: "command" | "pipeline";
    commands: Command[];
}

export class ShellParser {
    public output: Output | undefined;

    public parse(input: string) {
        const tokens = this.tokenize(input);

        this.output = this.parseTokens(tokens);
    }

    public firstProgram() {
        if (!this.output || this.output.commands.length === 0) {
            return "";
        }

        return this.output.commands[0].program;
    }

    private tokenize(input: string) {
        const tokens: string[] = [];
        let buffer = "";

        for (const char of input) {
            if (char === "|") {
                tokens.push(buffer.trim());
                tokens.push(char);
                buffer = "";

                continue;
            }

            buffer += char;
        }

        tokens.push(buffer.trim());

        return tokens;
    }

    private parseTokens(tokens: string[]): Output {
        const commands: Command[] = [];
        let type: "command" | "pipeline" = "command";

        for (const token of tokens) {
            if (token === "|") {
                type = "pipeline";
                continue;
            }

            const parts = token.split(" ");

            const command: Command = {
                program: parts[0],
                args: parts.slice(1)
            };

            commands.push(command);
        }

        return {
            type: type,
            commands: commands
        };
    }
}