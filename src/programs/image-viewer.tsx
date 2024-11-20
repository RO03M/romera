import type { ProcessComponentProps } from "../@core/processes/types";
import { blobFromFile } from "../@core/utils/file";
import { useAsyncMemo } from "../@core/hooks/use-async-memo";

export function ImageViewer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const blob = useAsyncMemo(async () => {
		if (workingDirectory === undefined) {
			return null;
		}

		return await blobFromFile(workingDirectory);
	}, [workingDirectory], null);

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
