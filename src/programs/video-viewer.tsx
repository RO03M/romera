import { useMemo } from "preact/hooks";
import type { ProcessComponentProps } from "../@core/processes/types";
import { blobFromFile } from "../@core/utils/file";

export function VideoViewer(props: ProcessComponentProps) {
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
		// biome-ignore lint/a11y/useMediaCaption: <explanation>
        <video
			src={blob}
            controls={true}
			style={{
				width: "100%",
				height: "100%",
				backgroundSize: "contain",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center"
			}}
		/>
	);
}
