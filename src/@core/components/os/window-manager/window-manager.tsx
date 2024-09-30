import { useMemo } from "preact/hooks";
import { Window } from "../desktop/window/window";
import { useProcessesStore } from "../../../processes/use-processes-store";
import styled from "styled-components";

export function WindowManager() {
	const { processes } = useProcessesStore();

	const windowProcesses = useMemo(() => {
		return processes.filter((process) => process.Component !== undefined);
	}, [processes]);

	return (
		<Wrapper>
			{windowProcesses.map((process) => (
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
	width: "100%",
	height: "100%",
	position: "absolute",
	overflow: "hidden"
}, {
	id: "window-manager",
	name: "window-manager-container"
});
