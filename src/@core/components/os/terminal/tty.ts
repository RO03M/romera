import type { Bash } from "./bash";

export class TTYManager {
	public terminals = new Map<number, Bash>();
}
