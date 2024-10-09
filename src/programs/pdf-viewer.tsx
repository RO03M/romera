import { useMemo } from "preact/hooks";
import type { ProcessComponentProps } from "../@core/processes/types";
import { blobFromFile } from "../@core/utils/file";

export function PdfViewer(props: ProcessComponentProps) {
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
		<embed
			src={blob}
            width={"100%"}
            height={"100%"}
		/>
	);
}
