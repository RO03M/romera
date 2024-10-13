import { useCallback } from "preact/compat";
import { ContextMenu } from "../context-menu/context-menu";
import { filesystem } from "../../../../app";
import { safe } from "../../../utils/safe";

export function DesktopContext() {
	const onShortcut = useCallback((event: KeyboardEvent) => {
		console.log(event);
	}, []);

	const newDirectory = useCallback((index = 0) => {
		const response = safe(() =>
			filesystem.mkdir(`/home/romera/desktop/new directory(${index})`)
		);

		if (response.error !== null) {
			newDirectory(index + 1);
		}
	}, []);

	return (
		<ContextMenu>
			<li>
				<span>New</span>
				<ul>
					<li
						onClick={() => newDirectory()}
						onKeyDown={onShortcut}
					>
						Directory
					</li>
					<li onClick={() => console.log("new file")} onKeyDown={onShortcut}>
						File
					</li>
				</ul>
			</li>
		</ContextMenu>
	);
}
