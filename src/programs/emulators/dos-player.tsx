import type { DosPlayer as Instance, DosPlayerFactoryType } from "js-dos";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { ProcessComponentProps } from "../../@core/processes/types";
import { filesystem } from "../../app";

declare const Dos: DosPlayerFactoryType;

export default function DosPlayer(props: ProcessComponentProps) {
	const { workingDirectory } = props;
	const rootRef = useRef<HTMLDivElement>(null);

	const [dos, setDos] = useState<Instance | null>(null);

	const file = useMemo(() => {
		if (!workingDirectory) {
			return null;
		}

		const file = filesystem.readFile(workingDirectory, { decode: false });

		return file;
	}, [workingDirectory]);

	const bundleUrl = useMemo(() => {
		if (file === null) {
			return null;
		}

		return URL.createObjectURL(new Blob([file], { type: "application" }));
	}, [file]);

	useEffect(() => {
		if (rootRef === null || rootRef.current === null) {
			return;
		}

		const root = rootRef.current as HTMLDivElement;
		const instance = Dos(root, {
			noSideBar: true
		});

		setDos(instance);

		return () => {
			instance.stop();
		};
	}, []);

	useEffect(() => {
		if (dos !== null && bundleUrl !== null && typeof bundleUrl === "string") {
			dos.run(bundleUrl); // ci is returned
		}
	}, [dos, bundleUrl]);

	return <div ref={rootRef} style={{ width: "100%", height: "100%" }} />;
}
