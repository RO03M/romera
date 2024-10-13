import { create } from "zustand";

interface TTY {
	id: number;
	echo: (message: string) => void;
	lock: () => void;
	free: () => void;
}

interface TTYStore {
	ttys: Map<TTY["id"], TTY>;
	addTTY: (tty: TTY) => void;
	getTTY: (id: TTY["id"]) => TTY | undefined;
}

export const useTTYStore = create<TTYStore>()((set, get) => ({
	addTTY(tty) {
		const ttys = get().ttys;

		ttys.set(tty.id, tty);

		set({ ttys });
	},
	getTTY(id: TTY["id"]) {
		return get().ttys.get(id);
	},
	ttys: new Map()
}));
