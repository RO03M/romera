import { useEffect, useState } from "preact/hooks";

export function useWindowSize() {
	const [windowSize, setWindowSize] = useState([
		window.innerWidth,
		window.innerHeight
	]);
	const [windowWidth, windowHeight] = windowSize;

	useEffect(() => {
		let resizeTimeoutId: number;
		function onResize() {
			clearTimeout(resizeTimeoutId);
			resizeTimeoutId = setTimeout(() => {
				setWindowSize([window.innerWidth, window.innerHeight]);
			}, 200);
		}

		window.addEventListener("resize", onResize);

		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	return {
		width: windowWidth,
		height: windowHeight
	};
}
