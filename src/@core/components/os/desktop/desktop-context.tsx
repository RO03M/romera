import { useCallback } from "preact/compat";
import { ContextMenu } from "../context-menu/context-menu";
import { filesystem, processScheduler } from "../../../../app";
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

	const newFile = useCallback((index = 0) => {
		const response = safe(() =>
			filesystem.writeFile(`/home/romera/desktop/new file(${index})`, "")
		);

		if (response.error !== null) {
			newFile(index + 1);
		}
	}, []);

	const openTerminal = useCallback(() => {
		processScheduler.spawnMagicWindow("terminal", "/home/romera/desktop");
	}, []);

	return (
		<ContextMenu>
			<li>
				<span>New</span>
				<ul>
					<li onClick={() => newDirectory()} onKeyDown={onShortcut}>
						Directory
					</li>
					<li onClick={() => newFile()} onKeyDown={onShortcut}>
						File
					</li>
				</ul>
			</li>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<li onClick={openTerminal}>Open terminal here</li>
		</ContextMenu>
	);
}
