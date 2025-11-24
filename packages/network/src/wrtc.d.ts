declare module "wrtc" {
    const RTCPeerConnection: any;
    const RTCIceCandidate: any;
    const RTCSessionDescription: any;
    const mediaDevices: any;

    export {
        RTCPeerConnection,
        RTCIceCandidate,
        RTCSessionDescription,
        mediaDevices
    };
}