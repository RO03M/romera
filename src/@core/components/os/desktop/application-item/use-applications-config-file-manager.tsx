import { useCallback, useMemo } from "preact/hooks";
import { useDir } from "../../../../filesystem/hooks/use-directory";

export function useApplicationsConfigFileManager() {
	const applicationsDir = useDir("/usr/applications");

	const parsedApplications = useMemo(() => {
		if (applicationsDir === null || applicationsDir.nodes === undefined) {
			return [];
		}

		return applicationsDir.nodes
			.filter((node) => node.type === "file" && node.content !== undefined)
			.map((node) => ({
				name: node.name,
				pos: node.content
			}));
	}, [applicationsDir]);

	const isPositionFree = useCallback(
		(x: number, y: number, nameToIgnore: string) => {
			const applications = parsedApplications.filter(
				(application) => application.name !== nameToIgnore
			);
			return (
				applications.findIndex(
					(application) => application.pos === `${x},${y}`
				) === -1
			);
		},
		[parsedApplications]
	);

	return {
		isPositionFree
	};
}
