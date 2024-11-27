import type { WatchCallback, WatchEvent } from "./types";

export class FilesystemWatcher {
	public events: Map<string, WatchCallback[]> = new Map();

	public watch(filepath: string, callback: WatchCallback) {
		const callbacks = this.events.get(filepath) ?? [];
		this.events.set(filepath, [...callbacks, callback]);
	}

	public emit(filepath: string, event: WatchEvent) {
		const callbackList = this.events.get(filepath) ?? [];
		for (const callback of callbackList) {
			callback(event);
		}
	}

	public unwatch(filepath: string, callback: WatchCallback) {
		const callbackList = this.events.get(filepath) ?? [];

		this.events.set(filepath, callbackList.filter((callbackItem) => callbackItem !== callback));
	}
}
