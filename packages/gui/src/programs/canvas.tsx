import { useEffect, useRef } from "preact/hooks";
import type { ProcessComponentProps } from "../@core/processes/types";
import { Kernel } from "@romos/kernel";

type CanvasProps = ProcessComponentProps;

export function Canvas(props: CanvasProps) {
	const { args } = props;
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const [pid] = args;
        console.log(pid);
        if (pid === undefined) {
            return;
        }

        const process = Kernel.instance().scheduler.processes.find((process) => process.pid === +pid);
        
        console.log(process, pid);

        if (process === undefined) {
            return;
        }

        const offscreen = ref.current?.transferControlToOffscreen();

        if (offscreen === undefined) {
            return;
        }

        console.log(process, offscreen);

        process.stdin({ canvas: offscreen }, {
            transfer: [offscreen]
        });
    }, [args]);

	return <canvas id={"teste"} ref={ref} />;
}
