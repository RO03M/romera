import { describe, expect, it, vi } from "vitest";
import { Watcher } from "./watcher";

describe("watcher class", () => {
    const watcher = new Watcher<"created" | "terminated", number>();
    it("Should have no events when instantiated", () => {
        expect(watcher.events).toEqual(new Map());
    });

    it("Should be able to watch events", () => {
        const foo = vi.fn(() => {});
        watcher.watch(1, "created", foo);

        watcher.emit(1, "created");

        expect(foo).toBeCalledTimes(1);
    });

    it("It shouldn't be called if a different event was emitted", () => {
        const foo = vi.fn(() => {});
        watcher.watch(1, "created", foo);

        watcher.emit(1, "terminated");

        expect(foo).not.toBeCalled();
    })

    it("Should be able to unwatch events", () => {
        const foo = vi.fn(() => {});
        watcher.watch(1, "created", foo);
        watcher.unwatch(1, "created", foo)
        watcher.emit(1, "created");

        expect(foo).not.toBeCalled();
    });

    it("Should be able to call multiple callbacks", () => {
        const callback1 = vi.fn(() => {});
        const callback2 = vi.fn(() => {});

        watcher.watch(2, "created", callback1);
        watcher.watch(2, "created", callback2);

        watcher.emit(2, "created");
        watcher.emit(2, "terminated");

        expect(callback1).toHaveBeenCalledOnce();
        expect(callback2).toHaveBeenCalledOnce();
    });

    it("Should be able to assign multiple callbacks, unassign one and the remaining must keep working", () => {
        const callback1 = vi.fn(() => {});
        const callback2 = vi.fn(() => {});

        watcher.watch(3, "created", callback1);
        watcher.watch(3, "created", callback2);

        watcher.unwatch(3, "created", callback1);

        watcher.emit(3, "created");
        watcher.emit(3, "terminated");

        expect(callback1).not.toHaveBeenCalledOnce();
        expect(callback2).toHaveBeenCalledOnce();
    });

    it("Should be able to clear the events queue", () => {
        watcher.clear();
        expect(watcher.events).toEqual(new Map());
    });
});