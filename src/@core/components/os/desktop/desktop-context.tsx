import { useCallback } from "preact/compat";
import { ContextMenu } from "../context-menu/context-menu";

export function DesktopContext() {
	const onShortcut = useCallback((event: KeyboardEvent) => {
		console.log(event);
	}, []);

	return (
		<ContextMenu>
			<li>
				<span>New</span>
				<ul>
					<li onClick={() => console.log("new directory")} onKeyDown={onShortcut}>Directory</li>
					<li onClick={() => console.log("new file")} onKeyDown={onShortcut}>File</li>
				</ul>
			</li>
		</ContextMenu>
	);
}
