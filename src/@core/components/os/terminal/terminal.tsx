import { useEffect, useRef } from "preact/hooks";
import styled from "styled-components";
import { Bash } from "./bash";

export function TerminalProgram() {
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (wrapperRef.current === null) {
			return;
		}

		const bash = new Bash(wrapperRef.current);

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target !== wrapperRef.current) {
					return;
				}

				bash.fit();
			}
		});

		resizeObserver.observe(wrapperRef.current);

		return () => {
			if (wrapperRef.current !== null) {
				resizeObserver.unobserve(wrapperRef.current);
			}
			bash.dispose();
		};
	}, []);

	return <Wrapper ref={wrapperRef} />;
}

const Wrapper = styled.div({
	height: "100%",
	backgroundColor: "#000"
});
