import { filesystem } from "../../../../../app";
import {
	isMagicProgram,
	type programTable
} from "../../../../../programs/program-table";
import { normalize } from "../../../../filesystem/utils/path";
import { getConfigFromApplication } from "./application-config-file";

export async function getExecutableFromApplication(
	name: string
): Promise<keyof typeof programTable> {
	const stat = filesystem.stat(`/home/romera/desktop/${normalize(name)}`);
	const configuration = await getConfigFromApplication(name);

	if (isMagicProgram(configuration.defaultExecName)) {
		return configuration.defaultExecName;
	}

	if (stat?.isDirectory()) {
		return "explorer";
	}

	if (stat?.isFile()) {
		return "monaco";
	}

	return "terminal";
}
