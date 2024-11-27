import type { HydrationData } from "../types";
import { bin } from "./bin";
import { home } from "./home";
import { usr } from "./usr";

export const initialRoot: HydrationData = {
	name: "/",
	type: "dir",
	nodes: [bin, home, usr]
};
