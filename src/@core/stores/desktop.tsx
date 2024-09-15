import { create } from "zustand";

export interface DesktopItem {
	id: number;
	gridPosition: [number, number];
	name: string;
}

interface DesktopItemStore {
	items: DesktopItem[];
	getItemById: (id: DesktopItem["id"]) => DesktopItem | undefined;
	updateDesktopItemPosition: (
		id: number,
		gridPosition: [number, number]
	) => void;
	isPositionFree: (gridPosition: [number, number], ignoreIds?: DesktopItem["id"][]) => boolean;
}

export const useDesktopItems = create<DesktopItemStore>()((set, get) => ({
	items: [
		{
			id: 0,
			gridPosition: [0, 0],
			name: "Chrome"
		},
		{
			id: 1,
			gridPosition: [5, 2],
			name: "Burro"
		}
	],
	getItemById(id) {
		return get().items.find((item) => item.id === id);
	},
	updateDesktopItemPosition(id, gridPosition) {
		let [x, y] = gridPosition;
		if (x < 0) {
			x = 0;
		}

		if (y < 0) {
			y = 0;
		}

		const items: DesktopItem[] = get().items.map((item) => {
			if (item.id === id) {
				item.gridPosition = [x, y];
			}

			return item;
		});

		set({ items });
	},
	isPositionFree(gridPosition, ignoreIds = []) {
		const itemInPosition = get().items.find((item) => {
			if (ignoreIds.includes(item.id)) {
				return false;
			}

			return (
				item.gridPosition[0] === gridPosition[0] &&
				item.gridPosition[1] === gridPosition[1]
			);
		});

		return itemInPosition === undefined;
	}
}));
