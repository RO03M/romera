interface TTY {
    echo(...args: string[]): unknown;
    workingDirectory: string;
}

export class TTYManager {
	public terminals = new Map<number, TTY>();
}
