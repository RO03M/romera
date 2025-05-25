import { describe, expect, it, vi } from "vitest";
import { Stream } from "./stream";


process.stdin.on("data", (foo) => console.log(foo))

describe("Stream", async () => {
    it("Should be able to pass data from one stream to another", async () => {
        const stream = new Stream();
        const targetStream = new Stream();

        const listener = vi.fn(() => {});

        targetStream.on("pipe", listener);

        stream.pipe(targetStream);
        stream.write("content from stream 1");

        expect(listener).toHaveBeenCalledWith("content from stream 1");
    });

    it("Should be able to read chunks", async () => {
        const stream = new Stream();
        const data = ["data", "to", "be", "passed", null];

        let index = 0;
        const interval = setInterval(() => {
            if (index == data.length) {
                clearInterval(interval);
                return;
            }

            stream.push(data[index]);
            index++;
        }, 50);

        const dataListener = vi.fn(() => {});
        const endListener = vi.fn(() => {});

        stream.on("data", dataListener);
        stream.on("end", endListener);

        const result = await stream.read();
        expect(dataListener).toHaveBeenCalledTimes(4);
        expect(endListener).toHaveBeenCalledOnce();
    });

    it("Should be able to pipe from a read to a write stream", async () => {
        const readable = new Stream();
        const writable = new Stream();

        writable.pipe(readable);

        readable.on("pipe", (data) => {
            console.log(data);
        });

        writable.write("teste");
        writable.write("teste");
        writable.write("teste");
    })
});
