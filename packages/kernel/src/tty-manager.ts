interface TTY {
    echo(...args: string[]): unknown;
}

export class TTYManager {
	public terminals = new Map<number, TTY>();
}
