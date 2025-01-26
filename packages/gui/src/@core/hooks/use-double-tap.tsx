import type { RefObject } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

export function useDoubleTap(
	ref: RefObject<HTMLElement | undefined>,
	callback: (event?: TouchEvent) => void
) {
	const lastTouch = useRef(Date.now());

	const onTouchend = useCallback(
		(event: TouchEvent) => {
			const deltaTime = Date.now() - lastTouch.current;
			lastTouch.current = Date.now();
			if (deltaTime <= 200 && deltaTime >= 0) {
				callback(event);
			}
		},
		[callback]
	);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		ref.current.addEventListener("touchend", onTouchend);

		return () => {
			if (!ref.current) {
				return;
			}

			ref.current.removeEventListener("touchend", onTouchend);
		};
	}, [ref.current, onTouchend]);
}
