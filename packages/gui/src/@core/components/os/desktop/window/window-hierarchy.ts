import { OrderChangeEvent } from "./order-change-event";

export class WindowHierarchy {
    private orders = new Map<number, number>();
    private static _instance: WindowHierarchy;

    public static instance() {
        if (!this._instance) {
            this._instance = new WindowHierarchy();
        }

        return this._instance;
    }

    public getHighest() {
        if (this.orders.size === 0) {
            return -1;
        }

        return Math.max(...this.orders.values()) ?? 0;
    }

    public getOrAllocate(pid: number) {
        if (this.orders.has(pid)) {
            return this.orders.get(pid)!;
        }

        const highest = this.getHighest();
        const value = highest + 1;
        this.orders.set(pid, value);

        return value;
    }

    public promote(pid: number) {
        const highest = this.getHighest();

        if (this.orders.get(pid) === highest) {
            // If the current pid is already the highest, do nothing
            return;
        }

        const value = highest + 1;
        this.orders.set(pid, value);

        // reorders and emits
        this.normalize();

        return value;
    }

    public normalize() {
        const entries = [...this.orders.entries()];

        entries.sort((a, b) => a[1] - b[1]);

        let newOrder = 1;
        for (const [pid, oldOrder] of entries) {
            const newValue = newOrder++;

            if (newValue !== oldOrder) {
                this.orders.set(pid, newValue);
                this.tryEmitChange(pid, newValue);
            }
        }
    }

    public tryEmitChange(pid: number, order: number) {
        if (!document) {
            return;
        }

        document.dispatchEvent(new OrderChangeEvent(pid, order));
    }
}