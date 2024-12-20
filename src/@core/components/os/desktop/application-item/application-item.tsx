import { normalize } from "../../../../filesystem/utils/path";
import styled from "styled-components";
import type { Stat } from "../../../../filesystem/stat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { getExecutableFromApplication } from "./get-executable-from-application";
import { useClickOutside } from "../../../../hooks/use-click-outside";
import { NameDisplay } from "./name-display";
import { filesystem, processScheduler } from "../../../../../app";
import { desktop } from "../../../../../constants";
import { ApplicationConfig } from "./application-config-file";
import { useDoubleTap } from "../../../../hooks/use-double-tap";
import { useAsyncMemo } from "../../../../hooks/use-async-memo";

interface ApplicationItemProps {
	name: string;
	icon: string;
	type: Stat["type"];
}

export function ApplicationItem(props: ApplicationItemProps) {
	const { name, icon } = props;

	const [x, setX] = useState(1);
	const [y, setY] = useState(0);
	const [focused, setFocused] = useState(false);

	const ref = useRef<HTMLDivElement | null>(null);

	const programName = useAsyncMemo(
		() => getExecutableFromApplication(name),
		[name]
	);

	useClickOutside(ref, () => setFocused(false));

	const syncPosition = useCallback(async () => {
		const config = await ApplicationConfig.fromFSApplication(name);
		setX(+config.x + 1);
		setY(+config.y + 1);
	}, [name]);

	const openProgram = useCallback(() => {
		if (programName === undefined) {
			return;
		}

		processScheduler.spawnMagicWindow(
			programName,
			normalize(`/home/romera/desktop/${name}`)
		);
	}, [name, programName]);

	useEffect(() => {
		filesystem.watch(`/usr/applications/${name}`, () => {
			syncPosition();
		});
	}, [name, syncPosition]);

	useEffect(() => {
		syncPosition();
	}, [syncPosition]);

	useDoubleTap(ref, openProgram);

	return (
		<Wrapper
			ref={ref}
			className={"application-item"}
			draggable={true}
			$gridX={x}
			$gridY={y}
			onDblClickCapture={openProgram}
			onDragStart={(event) => {
				event.dataTransfer?.setData(
					"filedrag",
					JSON.stringify({
						filepath: `/home/desktop/romera/${name}`,
						name
					})
				);
			}}
		>
			<ContentContainer
				$focused={focused}
				aria-program-name={programName}
				aria-focused={focused}
				onPointerDown={() => setFocused(true)}
			>
				<Icon style={{ backgroundImage: `url("${icon}")` }} />
				<NameDisplay focused={focused} value={name} />
			</ContentContainer>
		</Wrapper>
	);
}

const Wrapper = styled.div<{ $gridX: number; $gridY: number }>((props) => ({
	cursor: "initial !important",
	width: desktop.grid.width,
	height: desktop.grid.height,
	userSelect: "none",
	gridColumnStart: props.$gridX,
	gridRowStart: props.$gridY
}));

const ContentContainer = styled.div<{ $focused: boolean }>((props) => ({
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: 4,
	backgroundColor: props.$focused
		? `${props.theme.colors.blue[500]}33`
		: "none",
	border: props.$focused ? `1px dotted ${props.theme.colors.blue[500]}` : "none"
}));

const Icon = styled<"div">("div")({
	width: "50%",
	height: "50%",
	backgroundImage: `url("./application-icons/blank-icon.png")`,
	backgroundSize: "cover",
	backgroundPosition: "center"
});
