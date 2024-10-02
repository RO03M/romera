import { create } from "zustand";

interface TTY {
	id: number;
	echo: (message: string) => void;
}

interface TTYStore {
	ttys: Map<TTY["id"], TTY>;
	addTTY: (tty: TTY) => void;
}

export const useTTYStore = create<TTYStore>()((set, get) => ({
	addTTY(tty) {
		const ttys = get().ttys;

		ttys.set(tty.id, tty);

		set({ ttys });
	},
	ttys: new Map()
}));
