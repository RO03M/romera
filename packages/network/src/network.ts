import Peer, { DataConnection } from "peerjs";

export class Network {
    public readonly ip: string;
    private peer: Peer;
    private connections = new Map<string, DataConnection>();

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
    
    public get connected() {
        return this.peer.disconnected;
    }

    public bind() {
        return new Promise((resolve) => {
            this.peer.on("open", resolve);
        });
    }

    public async sendTo(ip: string, data: unknown) {
        if (!this.connections.has(ip)) {
            await this.connect(ip);
        }
        
        const connection = this.connections.get(ip);
        
        if (!connection) {
            throw new Error("failed to get connection");
        }
        
        await connection.send(data);
    }
    
    private addConnection(ip: string, connection: DataConnection) {
        this.connections.set(ip, connection);
    }
    
    private destroyConnection(ip: string) {
        this.connections.delete(ip);
    }
    
    public connect(target: string) {
        const connection = this.peer.connect(target);
        this.addConnection(target, connection);

        return new Promise<DataConnection>((resolve) => {
            connection.on("open", () => {
                console.log("connected from: ", this.ip, " to ", target);
                resolve(connection);
            });
        });
    }

    public generateIp() {
        return Array.from({ length: 8 }, () => Math.floor(Math.random() * 256)).join("_");
    }
}