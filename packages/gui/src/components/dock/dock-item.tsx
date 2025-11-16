import { useCallback } from "preact/hooks";
import { getIconBlobFromFile } from "../../os/get-icon-from-file";
import styles from "./dock.module.css";
import { useAsyncMemo } from "../../@core/hooks/use-async-memo";
import type { Stat } from "@romos/fs";
import { WindowHierarchy } from "../../@core/components/os/desktop/window/window-hierarchy";
import { VisibilityChangeEvent } from "../../@core/components/os/desktop/window/visibility-change-event";

interface ItemProps {
	pid: number;
	showName: boolean;
	name: string;
	type: Stat["type"];
}

export function DockItem(props: ItemProps) {
	const icon = useAsyncMemo(
		async () => {
			return (await getIconBlobFromFile(props.name, props.type)) ?? "";
		},
		[props.name, props.type],
		""
	);

	const focusWindow = useCallback(() => {
		document.dispatchEvent(new VisibilityChangeEvent(props.pid, false, true));
		WindowHierarchy.instance().promote(props.pid);
	}, [props.pid]);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className={styles.item}
			onClick={focusWindow}
			style={{
				backgroundImage: `url("${icon}")`
			}}
		/>
	);
}
