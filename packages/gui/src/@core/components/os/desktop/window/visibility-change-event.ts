export class VisibilityChangeEvent extends CustomEvent<{ pid: number, visible: boolean, toggle: boolean }> {
    public static readonly key: string = "window_change_visibility";

    constructor(pid: number, visible: boolean, toggle: boolean) {
        super(VisibilityChangeEvent.key, {
            detail: {
                pid: pid,
                visible: visible,
                toggle: toggle
            }
        });
    }
}