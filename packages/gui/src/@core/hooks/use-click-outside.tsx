import type { RefObject } from "preact";
import { useCallback, useEffect } from "preact/hooks";

export function useClickOutside(
	ref: RefObject<HTMLElement | undefined>,
	callback: () => void
) {
	const onClick = useCallback(
		(event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
				callback();
			}
		},
		[ref, callback]
	);

	useEffect(() => {
		document.addEventListener("click", onClick);

		return () => {
			document.removeEventListener("click", onClick);
		};
	});
}
