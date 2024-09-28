import { incrementalId } from "../../utils/incremental-id";
import type { Node } from "../node";
import { bin } from "./bin";
import { home } from "./home";
import { usr } from "./usr";

export const initialRoot: Node = {
	id: incrementalId(),
	name: "/",
	type: "directory",
	nodes: [
		bin,
		home,
		usr
	]
};
