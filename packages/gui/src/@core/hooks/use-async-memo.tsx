import { useEffect, useState } from "preact/hooks";

export function useAsyncMemo<T>(
	fn: () => Promise<T>,
	deps: ReadonlyArray<unknown>
): T | undefined;
export function useAsyncMemo<T>(
	fn: () => Promise<T>,
	deps: ReadonlyArray<unknown>,
	initialValue: T
): T;
export function useAsyncMemo<T>(
	fn: () => Promise<T>,
	deps: ReadonlyArray<unknown>,
	initialValue?: T
) {
	const [result, setResult] = useState<T | undefined>(initialValue);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Although deps is not used, I need to recall the promise
	useEffect(() => {
		let cancel = false;
		fn().then((result) => {
			if (cancel) {
				return;
			}

			setResult(result);
		});

		return () => {
			cancel = true;
		};
	}, deps);

	return result;
}
