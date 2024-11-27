import { useEffect, useState } from "preact/hooks";
import type { Dirent } from "../../@core/filesystem/dirent";
import { filesystem } from "../../app";

export function useEntries(path: string | undefined) {
	const [entries, setEntries] = useState<Dirent[]>([]);

	useEffect(() => {
		if (path === undefined) {
			setEntries([]);
			return;
		}
		function onDirChange() {
			if (path === undefined) {
				return;
			}

			const direntries = filesystem.readdir(path, {
				withFileTypes: true
			});

			direntries.unshift({
				inode: -1,
				name: "/..",
				type: "dir"
			});

			setEntries(direntries);
		}

        onDirChange();

		filesystem.watcher.watch(path, onDirChange);

		return () => {
			filesystem.watcher.unwatch(path, onDirChange);
		};
	}, [path]);

	return entries;
}
