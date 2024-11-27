import { useAsyncMemo } from "../@core/hooks/use-async-memo";
import type { ProcessComponentProps } from "../@core/processes/types";
import { blobFromFile } from "../@core/utils/file";

export function PdfViewer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const blob = useAsyncMemo(
		async () => {
			if (workingDirectory === undefined) {
				return null;
			}

			return blobFromFile(workingDirectory);
		},
		[workingDirectory],
		null
	);

	if (blob === null) {
		return <div>not found</div>;
	}

	return <embed src={blob} width={"100%"} height={"100%"} />;
}
