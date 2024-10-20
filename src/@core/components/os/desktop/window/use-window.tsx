import { type MutableRef, useCallback, useState } from "preact/hooks";
import type { DraggableData, Rnd } from "react-rnd";

type PreservedDataBeforeMaximization = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export function useWindow(_rndRef: MutableRef<Rnd | null>) {
	const [maximized, setMaximized] = useState(false);
	const [preservedDataBeforeMaximization, setPreservedDataBeforeMaximization] =
		useState<PreservedDataBeforeMaximization | null>(null);

	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [width, setWidth] = useState(400);
	const [height, setHeight] = useState(400);

	const maximize = useCallback(() => {
		setPreservedDataBeforeMaximization({
			x,
			y,
			width,
			height
		});
		setX(0);
		setY(0);
		setMaximized(true);
	}, [x, y, width, height]);

	const minimize = useCallback(() => {
		setMaximized(false);

		if (preservedDataBeforeMaximization === null) {
			return;
		}

		setX(preservedDataBeforeMaximization.x);
		setY(preservedDataBeforeMaximization.y);
	}, [preservedDataBeforeMaximization]);

	const toggleMaximization = useCallback(() => {
		if (maximized) {
			minimize();
		} else {
			maximize();
		}
	}, [maximize, minimize, maximized]);

	const onResizeStop = useCallback(
		(
			_event: MouseEvent | TouchEvent,
			_direction: string,
			elementRef: HTMLElement
		) => {
			const { offsetWidth, offsetHeight } = elementRef;

			setWidth(offsetWidth);
			setHeight(offsetHeight);
		},
		[]
	);

	const onDragStart = useCallback(
		(_event: unknown, _data: DraggableData) => {
			minimize();

			// if (rndRef.current !== null) {
			// 	rndRef.current.updatePosition({ x: _event.clientX, y: _event.clientY });
			// }
		},
		[minimize]
	);

	const onDragStop = useCallback(
		(_event: MouseEvent | TouchEvent, data: DraggableData) => {
			console.log(data.node.getBoundingClientRect());
			setX(data.x);
			setY(data.y);
		},
		[]
	);

	return {
		x,
		y,
		width,
		height,
		maximized,
		onResizeStop,
		onDragStart,
		onDragStop,
		toggleMaximization
	};
}
