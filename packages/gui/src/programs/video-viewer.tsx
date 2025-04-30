import { useAsyncMemo } from "../@core/hooks/use-async-memo";
import { blobFromFile } from "../@core/utils/file";
import type { ProcessComponentProps } from "./types";

export function VideoViewer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const blob = useAsyncMemo(
		async () => {
			if (workingDirectory === undefined) {
				return null;
			}

			return await blobFromFile(workingDirectory);
		},
		[workingDirectory],
		null
	);

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
