import { useMemo } from "preact/hooks";
import type { ProcessComponentProps } from "../@core/processes/types";
import { filesystem } from "../app";

export function ImageViewer(props: ProcessComponentProps) {
	const { workingDirectory } = props;

	const fileBuffer = useMemo(() => {
		if (workingDirectory === undefined) {
			return null;
		}

		const buffer = filesystem.readFile(workingDirectory);
		return buffer;
	}, [workingDirectory]);

	const blob = useMemo(() => {
		if (fileBuffer === null || typeof fileBuffer === "string") {
			return null;
		}

		return URL.createObjectURL(new Blob([fileBuffer], { type: "image/png" }));
	}, [fileBuffer]);

	if (blob === null) {
		return <div>unknown</div>;
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
