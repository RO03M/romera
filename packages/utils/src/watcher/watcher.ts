export type WatchCallback<EventType> = (event: EventType) => void;

export class Watcher<EventType, Target = string> {
	public events: Map<Target, Map<EventType, WatchCallback<EventType>[]>> =
		new Map();

	public watch(
		target: Target,
		event: EventType,
		callback: WatchCallback<EventType>
	) {
		const targetList = this.events.get(target);
		if (targetList === undefined) {
			this.events.set(target, new Map());
			this.watch(target, event, callback);
			return;
		}

		const callbacks = targetList.get(event) ?? [];
		targetList.set(event, [...callbacks, callback]);
		this.events.set(target, targetList);
	}

	
	public unwatch(target: Target, event: EventType, callback: WatchCallback<EventType>) {
		const targetList = this.events.get(target);
		if (targetList === undefined) {
			return;
		}

		
		const callbacks = targetList.get(event);
		if (callbacks === undefined) {
			return;
		}
	
		targetList.set(event, callbacks.filter((fn) => fn !== callback));
	}

	public emit(target: Target, event: EventType) {
		const targetCallbacks = this.events.get(target);
		if (targetCallbacks === undefined) {
			return;
		}

		const callbackList = targetCallbacks.get(event) ?? [];
		for (const callback of callbackList) {
			callback(event);
		}
	}

	public clear() {
		this.events = new Map();
	}
}
