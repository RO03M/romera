import { Editor } from "@monaco-editor/react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import type { ProcessComponentProps } from "../@core/processes/types";
import { filesystem } from "../app";

type CodeEditorProps = ProcessComponentProps;

export function CodeEditor(props: CodeEditorProps) {
	const { workingDirectory } = props;

	const [value, setValue] = useState<string | undefined>("");

	const fileContent = useMemo(() => {
		if (workingDirectory === undefined) {
			return "";
		}
		const content = filesystem.readFile(workingDirectory, { decode: true });
		if (content === null) {
			return "";
		}

		return content as string;
	}, [workingDirectory]);

	const writeFile = useCallback(() => {
		if (workingDirectory === undefined) {
			return;
		}

		filesystem.writeFile(workingDirectory, value ?? "");
	}, [value, workingDirectory]);

	useHotkeys("ctrl+s", writeFile, {
		preventDefault: true,
		enableOnFormTags: true
	});

	useEffect(() => {
		setValue(fileContent);
	}, [fileContent]);

	return (
		<Editor
			height={"100%"}
			defaultLanguage={"javascript"}
			defaultValue={value}
			onChange={setValue}
			theme={"vs-dark"}
		/>
	);
}
