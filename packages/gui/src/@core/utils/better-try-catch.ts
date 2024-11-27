export function btc<T>(fn: () => T): [null, T] | [Error, null] {
	try {
		return [null, fn()];
	} catch (error) {
		if (error instanceof Error) {
			return [error, null];
		}

		return [new Error("Unknown error"), null];
	}
}