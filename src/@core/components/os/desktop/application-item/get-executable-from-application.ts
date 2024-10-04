import { filesystem } from "../../../../../app";
import { normalize } from "../../../../filesystem/utils/path";
import { getConfigFromApplication } from "./application-config-file";

export function getExecutableFromApplication(name: string) {
	const stat = filesystem.stat(`/home/romera/desktop/${normalize(name)}`);
	const configuration = getConfigFromApplication(name);

    if (configuration.defaultExecName !== "") {
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
