import { useEffect, useRef } from "preact/hooks"

export function Teste() {
    const ref = useRef<HTMLCanvasElement>(null);

    console.log(ref);
    useEffect(() => {
        const offscreen = ref.current?.transferControlToOffscreen();

        if (offscreen === undefined) {
            return;
        }

        const worker = new Worker("./teste.js");

        worker.postMessage({ canvas: offscreen }, { transfer: [offscreen] });
    }, []);

    return <canvas style={{ width: 1000, height: 1000 }} ref={ref} />
}