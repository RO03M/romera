import { useEffect, useRef } from "preact/hooks";
import type { ProcessComponentProps } from "../../../processes/types";
import styled from "styled-components";
import { Bash } from "./bash";

export function TerminalProgram(props: ProcessComponentProps) {
	const { workingDirectory = "/" } = props;

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

	return <div ref={wrapperRef} />;
}

const Wrapper = styled.div({
	backgroundColor: "#000",
	fontWeight: 700,
	color: "#fff",
	width: "100%",
	height: "100%",
	overflowY: "scroll",
	textRendering: "optimizeLegibility",
	whiteSpace: "pre",
	letterSpacing: 0.7
});
