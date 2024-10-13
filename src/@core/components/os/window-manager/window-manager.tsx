import { useEffect, useState } from "preact/hooks";
import { Window } from "../desktop/window/window";
import styled from "styled-components";
import { processScheduler } from "../../../../app";
import type { Process } from "../../../processes/process";

export function WindowManager() {
	const [processes, setProcesses] = useState<Process[]>([]);

	useEffect(() => {
		processScheduler.watch("all", ["ran", "killed"], () => {
			setProcesses(
				processScheduler.processes.filter(
					(processes) => processes.Component !== undefined
				)
			);
		});
	}, []);

	return (
		<Wrapper id={"window-manager"}>
			{processes.map((process) => (
				<Window
					key={process.pid}
					pid={process.pid}
					Content={process.Component}
					contentArgs={process.componentArgs}
				/>
			))}
		</Wrapper>
	);
}

const Wrapper = styled.div({
	width: "100vw",
	height: "100vh",
	position: "absolute",
	overflow: "hidden",
	top: 0,
	left: 0
});
