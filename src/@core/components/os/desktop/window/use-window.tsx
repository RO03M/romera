import { type PanInfo, useMotionValue } from "framer-motion";
import { clamp } from "../../../../utils/math";
import { useCallback, useState } from "preact/hooks";
import { useWindowSize } from "../../../../hooks/use-window-size";

type PreservedDataBeforeMaximization = {
	x: number;
	y: number;
	width: number;
	height: number;
	top: number;
	left: number;
};

export function useWindow() {
	const windowSize = useWindowSize();

	const [maximized, setMaximized] = useState(false);
	const [preservedDataBeforeMaximization, setPreservedDataBeforeMaximization] =
		useState<PreservedDataBeforeMaximization | null>(null);

	const height = useMotionValue(400);
	const width = useMotionValue(400);
	const top = useMotionValue(0);
	const left = useMotionValue(0);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const resizeBarWidth = 10;
	const resizeBarHeight = 10;

	const handleTopDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		event.stopPropagation();
		const newHeight = clamp(height.get() - info.delta.y, 200);
		if (newHeight !== height.get()) {
			height.set(newHeight);
			top.set(top.get() + info.delta.y);
		}
	};

	const handleTopRightDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		event.stopPropagation();
		const newHeight = clamp(height.get() - info.delta.y, 200);
		if (newHeight !== height.get()) {
			height.set(newHeight);
			top.set(top.get() + info.delta.y);
		}

		width.set(clamp(width.get() + info.delta.x, 200));
	};

	const handleRightDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		event.stopPropagation();
		width.set(clamp(width.get() + info.delta.x, 200));
	};

	const handleBottomRightDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		event.stopPropagation();
		width.set(clamp(width.get() + info.delta.x, 200));
		height.set(clamp(height.get() + info.delta.y, 200));
	};

	const handleBottomDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		event.stopPropagation();
		height.set(clamp(height.get() + info.delta.y, 200));
	};

	const handleBottomLeftDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		event.stopPropagation();
		const newWidth = clamp(width.get() - info.delta.x, 200);
		if (newWidth !== width.get()) {
			width.set(newWidth);
			left.set(left.get() + info.delta.x);
		}
		height.set(clamp(height.get() + info.delta.y, 200));
	};

	const handleLeftDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		event.stopPropagation();
		const newWidth = clamp(width.get() - info.delta.x, 200);
		if (newWidth !== width.get()) {
			width.set(newWidth);
			left.set(left.get() + info.delta.x);
		}
	};

	const handleTopLeftDrag = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		event.stopPropagation();
		const newHeight = clamp(height.get() - info.delta.y, 200);
		if (newHeight !== height.get()) {
			height.set(newHeight);
			top.set(top.get() + info.delta.y);
		}

		const newWidth = clamp(width.get() - info.delta.x, 200);
		if (newWidth !== width.get()) {
			width.set(newWidth);
			left.set(left.get() + info.delta.x);
		}
	};

	const maximize = useCallback(() => {
		setPreservedDataBeforeMaximization({
			x: x.get(),
			y: y.get(),
			top: top.get(),
			left: left.get(),
			width: width.get(),
			height: height.get()
		});
		x.set(0);
		y.set(0);
		top.set(0);
		left.set(0);
		width.set(windowSize.width);
		height.set(windowSize.height);
		setMaximized(true);
	}, [x, y, top, left, width, height, windowSize]);

	const minimize = useCallback(() => {
		setMaximized(false);

		if (preservedDataBeforeMaximization === null) {
			return;
		}

		x.set(preservedDataBeforeMaximization.x);
		y.set(preservedDataBeforeMaximization.y);
		top.set(preservedDataBeforeMaximization.top);
		left.set(preservedDataBeforeMaximization.left);
		width.set(preservedDataBeforeMaximization.width);
		height.set(preservedDataBeforeMaximization.height);
	}, [x, y, top, left, width, height, preservedDataBeforeMaximization]);

	const toggleMaximization = useCallback(() => {
		if (maximized) {
			minimize();
		} else {
			maximize();
		}
	}, [maximize, minimize, maximized]);

	return {
		x,
		y,
		width,
		height,
		top,
		left,
		resizeBarWidth,
		resizeBarHeight,
		handleBottomDrag,
		handleLeftDrag,
		handleRightDrag,
		handleTopDrag,
		handleTopLeftDrag,
		handleTopRightDrag,
		handleBottomRightDrag,
		handleBottomLeftDrag,
		toggleMaximization
	};
}
