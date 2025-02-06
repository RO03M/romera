import { useEffect, useImperativeHandle, useMemo, useRef } from "preact/hooks";
import type { ProcessComponentProps, ProcessComponentRef } from "../@core/processes/types";
import { Kernel } from "@romos/kernel";
import { forwardRef } from "preact/compat";
import { useResizeObserver } from "../@core/hooks/use-resize-observer";
import { safe } from "@romos/utils";

type CanvasProps = ProcessComponentProps;

export const Canvas = forwardRef<ProcessComponentRef, CanvasProps>(function Canvas(props, ref) {
	const { args } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log(args);
    const pid = useMemo(() => args?.[0], [args]);
    const process = useMemo(() => {
        return Kernel.instance().scheduler.processes.find((process) => process.pid === +pid);
    }, [pid]);

    useResizeObserver(canvasRef, (foo) => {
        console.log("resize", foo);
        for (const entry of foo) {
            console.log(entry.contentRect.width, entry.contentRect.height)
        }
    })

    useImperativeHandle(ref, () => ({
        onClose() {
            console.log(process);
            if (process === undefined || process.ppid === null) {
                return;
            }

            console.log("going to kill ", process.ppid);
            Kernel.instance().scheduler.kill(process.ppid);
        },
    }), [process]);

    useEffect(() => {
        const [pid] = args;
        if (pid === undefined) {
            return;
        }

        const process = Kernel.instance().scheduler.processes.find((process) => process.pid === +pid);
        
        if (process === undefined) {
            return;
        }

        console.log(canvasRef.current, process);

        const { data: offscreen, error } = safe(() => canvasRef.current?.transferControlToOffscreen());

        if (error) {
            console.error(error);
            return;
        }

        if (offscreen === undefined) {
            return;
        }

        process.stdin({ canvas: offscreen }, {
            transfer: [offscreen]
        });
    }, []);

	return <canvas style={{ width: "100%", height: "100%" }} id={`canvas-${pid}`} ref={canvasRef} />;
})
