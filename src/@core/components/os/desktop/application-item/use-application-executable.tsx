import { useMemo } from "preact/hooks";
import { normalize } from "../../../../filesystem/utils/path";
import { applicationConfigurationParser } from "./use-applications-config-file-manager";
import { useNode } from "../../../../filesystem/hooks/use-node";
import { programTable } from "../../../../../programs/program-table";

export function useApplicationExecutable(name: string) {
	const desktopNode = useNode(`/home/romera/desktop/${normalize(name)}`);
	const configNode = useNode(`/usr/applications/${normalize(name)}`);

	const defaultProgramName = useMemo(() => {
		switch (desktopNode?.type) {
			case "directory":
				return "explorer";
			case "file":
				return "monaco";
			default:
				return "terminal";
		}
	}, [desktopNode?.type]);

	const preferableProgramName = useMemo(() => {
		if (configNode === null || configNode.type === "directory") {
			return null;
		}

		const { defaultExecName } = applicationConfigurationParser(
			configNode?.content
		);

		return defaultExecName;
	}, [configNode]);

	const programName = useMemo(() => {
		if (
			preferableProgramName !== null &&
			programTable[preferableProgramName] !== undefined
		) {
			return preferableProgramName;
		}

		return defaultProgramName;
	}, [defaultProgramName, preferableProgramName]);

    const ProgramComponent = useMemo(() => programTable[programName], [programName]);

	return {
		programName,
        ProgramComponent
    };
}
