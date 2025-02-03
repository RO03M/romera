import { forwardRef, useCallback } from "preact/compat";
import { filesystem } from "../../../../app";
import { safe } from "../../../utils/safe";
import { ContextMenu, type ContextMenuRef } from "../context-menu/context-menu";
import { Kernel } from "@romos/kernel";

export const DesktopContext = forwardRef<ContextMenuRef>(
	function DesktopContext(_, ref) {
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

		const newFile = useCallback(async (index = 0) => {
			const file = await safe(
				filesystem.readFile(`/home/romera/desktop/new file(${index})`)
			);

			if (file.data !== null) {
				await newFile(index + 1);
				return;
			}

			await safe(
				filesystem.writeFile(`/home/romera/desktop/new file(${index})`, "")
			);
		}, []);

		const openTerminal = useCallback(() => {
			Kernel.instance().scheduler.exec("component", ["terminal"], { cwd: "/home/romera/desktop", tty: -1 });
		}, []);

		const openFileExplorer = useCallback(() => {
			Kernel.instance().scheduler.exec("component", ["explorer"], { cwd:"/home/romera/desktop", tty: -1 });
		}, []);

		const openProcessManager = useCallback(() => {
			Kernel.instance().scheduler.exec("component", ["psman"]);
		}, []);

		const downloadFilesystem = useCallback(() => {
			const fsAsJSON = filesystem.getJSON();
			if (fsAsJSON === undefined) {
				throw new Error("Failed to create json from current filesystem");
			}

			const file = new Blob([JSON.stringify(fsAsJSON)], {
				type: "text/plain"
			});

			const a = document.createElement("a");
			a.href = URL.createObjectURL(file);
			a.download = "filesystem-romOS.json";
			a.click();
		}, []);

		return (
			<ContextMenu ref={ref}>
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
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<li onClick={openFileExplorer}>Open file explorer</li>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<li onClick={openProcessManager}>Open process manager</li>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<li onClick={downloadFilesystem}>Download filesystem</li>
			</ContextMenu>
		);
	}
);
