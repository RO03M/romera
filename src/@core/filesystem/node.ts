export interface File extends Omit<Node, "nodes"> {
    type: "file";
}

export interface Node {
    id: number;
    name: string;
    owner?: string;
    type: "file" | "directory";
    content?: string;
    nodes?: Node[];
    createdAt?: Date;
    updatedAt?: Date;
}
