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
