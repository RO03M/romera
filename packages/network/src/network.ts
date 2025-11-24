import Peer from "peerjs";

export class Network {
    public readonly ip: string;
    private peer: Peer;

    constructor() {
        this.ip = this.generateIp()
        this.peer = new Peer(this.ip);
        this.peer.on("connection", (conn) => {
            console.log(conn);

            conn.on("open", () => {
                console.log("connection opened");
            });

            conn.on("close", () => {
                console.log("connection closed");
            });
        });
    }

    public setup() {
        return new Promise((resolve) => {
            this.peer.on("open", resolve);
        });
    }

    public connect(target: string) {
        const connection = this.peer.connect(target);
        console.log(target, connection.open);
        
        return new Promise((resolve) => {
            connection.on("open", () => {
                console.log("connected from: ", this.ip, " to ", target);
                resolve("");
            });
        });
    }

    public generateIp() {
        return Array.from({ length: 8 }, () => Math.floor(Math.random() * 256)).join("_");
    }
}