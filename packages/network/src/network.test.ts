import { describe, it } from "vitest";
import { Network } from "./network";
import wrtc from "wrtc";

globalThis.RTCPeerConnection = wrtc.RTCPeerConnection;
globalThis.RTCSessionDescription = wrtc.RTCSessionDescription;
globalThis.RTCIceCandidate = wrtc.RTCIceCandidate;

describe("Network test", () => {
    it("Should be able to ping to another network", async () => {
        const n1 = new Network();
        const n2 = new Network();

        const foo = await n1.bind();
        console.log(foo);

        await n1.connect(n2.ip);
    });
});