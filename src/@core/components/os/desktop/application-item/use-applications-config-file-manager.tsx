import { useCallback, useMemo } from "preact/hooks";
import { useDir } from "../../../../filesystem/hooks/use-directory";

const allowedPropertyNames = ["x", "y", "defaultExecName"];

export function applicationConfigurationParser(configurationText = "") {
	const propertyLines = configurationText
		.replace(/(\r\n|\n|\r|\t)/gm, "")
		.split(";")
		.filter((x) => x.includes("="));

	const configuration: Record<string, string> = {};

	for (const line of propertyLines) {
		const [propertyName, value] = line.split("=");

		if (!allowedPropertyNames.includes(propertyName)) {
			continue;
		}

		configuration[propertyName] = value;
	}

	return configuration;
}

export function useApplicationsConfigFileManager() {
	const { dir: applicationsDir } = useDir("/usr/applications");

	const parsedApplications = useMemo(() => {
		if (applicationsDir === null || applicationsDir.nodes === undefined) {
			return [];
		}

		return applicationsDir.nodes
			.filter((node) => node.type === "file" && node.content !== undefined)
			.map((node) => {
				const configuration = applicationConfigurationParser(
					node.content as string
				);

				return {
					name: node.name,
					x: +configuration.x,
					y: +configuration.y
				};
			});
	}, [applicationsDir]);

	const isPositionFree = useCallback(
		(x: number, y: number, nameToIgnore: string) => {
			const applications = parsedApplications.filter(
				(application) => application.name !== nameToIgnore
			);

			return (
				applications.findIndex(
					(application) => application.x === x && application.y === y
				) === -1
			);
		},
		[parsedApplications]
	);

	return {
		isPositionFree
	};
}
