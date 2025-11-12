import { normalize, type Stat } from "@romos/fs";
import { useCallback, useRef, useState } from "preact/hooks";
import styles from "./grid-item.module.css";
import { useClickOutside } from "../../@core/hooks/use-click-outside";
import { Kernel } from "@romos/kernel";

interface GridItemProps {
	type: Stat["type"];
	filepath: string;
	program: string;
	name: string;
	icon: string;
	x: number;
	y: number;
}

export function GridItem(props: GridItemProps) {
	const [focused, setFocused] = useState(false);

	const ref = useRef<HTMLDivElement>(null);

	const exec = useCallback(() => {
		if (!props.program) {
			return;
		}
		
		Kernel.instance().scheduler.exec(
			"component",
			[props.program, props.program, normalize(props.filepath)],
			{ cwd: normalize(props.filepath), tty: -1 }
		)
	}, [props])

	useClickOutside(ref, () => {
		setFocused(false);
	});

	return (
		<div
			ref={ref}
			data-pos-x={props.x}
			data-pos-y={props.y}
			draggable={true}
			onDblClick={exec}
			onDragStart={(event) => {
				event.dataTransfer?.setData(
					"filedrag",
					props.name
				);
			}}
			className={`${styles["grid-item"]} ${focused ? styles.focused : ""}`}
			onPointerDown={() => setFocused(true)}
			style={{
				gridColumnStart: props.x + 1,
				gridRowStart: props.y + 1,
				backgroundImage: `url("${props.icon}")`
			}}
		>
			{props.name}
		</div>
	);
}
