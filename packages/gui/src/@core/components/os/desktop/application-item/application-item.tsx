import { filename, normalize } from "@romos/fs";
import styled from "styled-components";
import type { Stat } from "@romos/fs";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { getExecutableFromApplication } from "./get-executable-from-application";
import { useClickOutside } from "../../../../hooks/use-click-outside";
import { NameDisplay } from "./name-display";
import { filesystem } from "../../../../../app";
import { desktop } from "../../../../../constants";
import { ApplicationConfig } from "./application-config-file";
import { useDoubleTap } from "../../../../hooks/use-double-tap";
import { useAsyncMemo } from "../../../../hooks/use-async-memo";
import { Kernel } from "@romos/kernel";
import { ContextMenu, type ContextMenuRef } from "../../context-menu/context-menu";

interface ApplicationItemProps {
	name: string;
	icon: string;
	type: Stat["type"];
	initialX: number;
	initialY: number
}

export function ApplicationItem(props: ApplicationItemProps) {
	const { name, icon } = props;

	const [x, setX] = useState(props.initialX);
	const [y, setY] = useState(props.initialY);
	const [focused, setFocused] = useState(false);

	const contextRef = useRef<ContextMenuRef | null>(null);
	const ref = useRef<HTMLDivElement | null>(null);

	const programName = useAsyncMemo(
		() => getExecutableFromApplication(name),
		[name]
	);

	const syncPosition = useCallback(async () => {
		const config = await ApplicationConfig.fromFSApplication(name);

		setX(+config.x + 1);
		setY(+config.y + 1);
	}, [name]);

	const openProgram = useCallback(() => {
		if (programName === undefined) {
			return;
		}

		Kernel.instance().scheduler.exec(
			"component",
			[programName, programName, normalize(`/home/romera/desktop/${name}`)],
			{ cwd: normalize(`/home/romera/desktop/${name}`), tty: -1 }
		);
	}, [name, programName]);

	const exec = useCallback(() => {
		if (name === undefined) {
			return;
		}

		Kernel.instance().scheduler.exec(
			`/home/romera/desktop/${name}`,
			[],
			{ cwd: normalize(`/home/romera/desktop/${name}`), tty: -1 }
		);
	}, [name]);

	useEffect(() => {
		filesystem.watch(`/usr/applications/${name}`, () => {
			syncPosition();
		});
	}, [name, syncPosition]);

	useDoubleTap(ref, openProgram);

	useClickOutside(ref, () => {
		setFocused(false);
		contextRef.current?.close();
	});
	// console.log(filename(name), x, y);
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
			onDragEnd={() => {

			}}
			onContextMenu={(event) => {
				event.stopPropagation();
				contextRef.current?.show(event);
			}}
		>
			<ContextMenu ref={contextRef}>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<li onClick={exec}>
					<span>Execute</span>
				</li>
			</ContextMenu>
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
