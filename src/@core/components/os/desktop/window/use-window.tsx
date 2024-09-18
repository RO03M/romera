import { type PanInfo, useMotionValue } from "framer-motion";
import { clamp } from "../../../../utils/math";

export function useWindow() {
	const height = useMotionValue(400);
	const width = useMotionValue(400);
	const top = useMotionValue(0);
	const left = useMotionValue(0);
	const x = useMotionValue(50);
	const y = useMotionValue(0);
	const resizeBarWidth = 10;
	const resizeBarHeight = 10;

	const handleTopDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		event.stopPropagation();
		const newHeight = clamp(height.get() - info.delta.y, 200);
		if (newHeight !== height.get()) {
			height.set(newHeight);
			top.set(top.get() + info.delta.y);
		}
	};

	const handleTopRightDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		event.stopPropagation();
		const newHeight = clamp(height.get() - info.delta.y, 200);
		if (newHeight !== height.get()) {
			height.set(newHeight);
			top.set(top.get() + info.delta.y);
		}

		width.set(clamp(width.get() + info.delta.x, 200));
	};

	const handleRightDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		event.stopPropagation();
		width.set(clamp(width.get() + info.delta.x, 200));
	};

	const handleBottomRightDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		event.stopPropagation();
		width.set(clamp(width.get() + info.delta.x, 200));
		height.set(clamp(height.get() + info.delta.y, 200));
	};

	const handleBottomDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		event.stopPropagation();
		height.set(clamp(height.get() + info.delta.y, 200));
	};

	const handleBottomLeftDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		event.stopPropagation();
		const newWidth = clamp(width.get() - info.delta.x, 200);
		if (newWidth !== width.get()) {
			width.set(newWidth);
			left.set(left.get() + info.delta.x);
		}
		height.set(clamp(height.get() + info.delta.y, 200));
	};

	const handleLeftDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		event.stopPropagation();
		const newWidth = clamp(width.get() - info.delta.x, 200);
		if (newWidth !== width.get()) {
			width.set(newWidth);
			left.set(left.get() + info.delta.x);
		}
	};

	const handleTopLeftDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
		handleBottomLeftDrag
	};
}
