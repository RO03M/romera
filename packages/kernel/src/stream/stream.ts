import { ReadStream } from "node:fs";

export type StreamListener = (...args: any[]) => void
export type StreamChunk = string | null;

export class Stream {
    private events = new Map<string, StreamListener[]>();
    private data: StreamChunk[] = [];

    public on(event: string, listener: StreamListener): Stream {
        const listeners = this.events.get(event) ?? [];
        listeners.push(listener);

        this.events.set(event, listeners);

        return this;
    }

    public emit(event: string, ...args: any[]): Stream {
        const listeners = this.events.get(event) ?? [];

        for (const listener of listeners) {
            listener(...args);
        }

        return this;
    }

    public async push(chunk: StreamChunk) {
        if (chunk !== null) {
            this.data.push(chunk + "\n");
            this.emit("data", chunk, this.data);
            return;
        }

        this.data.push(chunk);
        this.emit("end");
    }

    public async read() {
        const promise = new Promise<StreamChunk[]>((resolve) => {
            this.on("end", () => resolve(this.data));
        });

        return promise;
    }
    public pipe(stream: Stream | ReadStream) {
        this.on("data", (chunk: string) => {
            stream.emit("pipe", chunk);
        });
    }

    public write(chunk: StreamChunk) {
        if (chunk !== null) {
            this.data.push(chunk + "\n");
            this.emit("data", chunk, this.data);
            return;
        }

        this.data.push(chunk);
        this.emit("end");
    }
}
