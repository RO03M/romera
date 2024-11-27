import { useCallback, useEffect, useState } from "preact/hooks";
import styled from "styled-components";

export function RightSide() {
	const [currentTime, setCurrentTime] = useState("");

	const updateTimer = useCallback(() => {
		const now = new Date();
		setCurrentTime(now.toLocaleTimeString());
	}, []);

	useEffect(() => {
		updateTimer();
		const interval = setInterval(updateTimer, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [updateTimer]);

	return (
		<div>
			<TimerTypography>{currentTime}</TimerTypography>
		</div>
	);
}

const TimerTypography = styled.span({
    userSelect: "none"
});
