export class OrderChangeEvent extends CustomEvent<{ pid: number; order: number }> {
    public static readonly key: string = "window_change_order";

    constructor(pid: number, order: number) {
        super(OrderChangeEvent.key, {
            detail: {
                pid: pid,
                order: order
            }
        });
    }
}