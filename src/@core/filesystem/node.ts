import type { ReactNode } from "preact/compat";

interface INode {
	id: number;
	name: string;
	owner?: string;
	description?: string;
	createdAt?: Date;
	updatedAt?: Date;
	nodes?: Node[];
}

export interface File extends INode {
	type: "file";
	content?: string;
}

export interface Directory extends INode {
	type: "directory";
}

export interface Gip extends INode {
	type: "gip";
	content?: {
		component: ReactNode;
	};
}

export type Node = File | Directory | Gip;
