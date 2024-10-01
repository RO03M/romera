import { create } from "zustand";

interface TTYStore {
	ttys?: unknown;
}

export const useTTYStore = create<TTYStore>()(() => ({}));
