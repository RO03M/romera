interface INode {
	id: number;
	name: string;
	owner?: string;
	description?: string;
	createdAt?: Date;
	updatedAt?: Date;
	nodes?: Node[];
	content?: unknown;
}

export interface File extends INode {
	type: "file";
	content?: string;
}

export interface Directory extends INode {
	type: "directory";
}

export type Node = File | Directory;
