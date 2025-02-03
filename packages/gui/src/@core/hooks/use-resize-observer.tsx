import { useEffect, type MutableRef } from "preact/hooks";

export function useResizeObserver(ref: MutableRef<Element | null>, callback: ResizeObserverCallback) {
    useEffect(() => {
        if (ref.current === null) {
            return;
        }

        const observer = new ResizeObserver(callback);

        observer.observe(ref.current);

        return () => {
            if (ref.current !== null) {
                observer.unobserve(ref.current);
            }
        }
    }, [ref.current, callback]);
}
