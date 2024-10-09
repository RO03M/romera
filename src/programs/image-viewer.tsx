import { useMemo } from "preact/hooks";
import type { ProcessComponentProps } from "../@core/processes/types";
import { blobFromFile } from "../@core/utils/file";

export function ImageViewer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const blob = useMemo(() => {
		if (workingDirectory === undefined) {
			return null;
		}

		return blobFromFile(workingDirectory);
	}, [workingDirectory]);

	if (blob === null) {
		return <div>not found</div>;
	}
    
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				backgroundImage: `url("${blob}")`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center"
			}}
		/>
	);
}
