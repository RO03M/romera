import { type PanInfo, useMotionValue } from "framer-motion";
import { clamp } from "../../../../utils/math";
import { useCallback, useState } from "preact/hooks";
import { useWindowSize } from "../../../../hooks/use-window-size";

export function useWindow() {
	const windowSize = useWindowSize();

	const [maximized, setMaximized] = useState(false);
	const [widthBeforeMaximize, setWidthBeforeMaximize] = useState(400);
	const [heightBeforeMaximize, setHeightBeforeMaximize] = useState(400);

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
		console.log(width.get());
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
		x.set(0);
		y.set(0);
		top.set(0);
		left.set(0);
		setWidthBeforeMaximize(width.get());
		setHeightBeforeMaximize(height.get());
		width.set(windowSize.width);
		height.set(windowSize.height);
		setMaximized(true);
	}, [x, y, top, left, width, height, windowSize]);

	const minimize = useCallback(() => {
		width.set(widthBeforeMaximize);
		height.set(heightBeforeMaximize);
		setMaximized(false);
	}, [width, height, widthBeforeMaximize, heightBeforeMaximize]);

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
