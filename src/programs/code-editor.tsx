import { Editor } from "@monaco-editor/react";
import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState } from "preact/hooks";
import { useFile } from "../@core/filesystem/hooks/use-file";

interface CodeEditorProps {
	filePath?: string;
}

export function CodeEditor(props: CodeEditorProps) {
	const { filePath } = props;

	const [value, setValue] = useState<string | undefined>("");

	const { file, writeFile } = useFile(filePath);

	useHotkeys("ctrl+s", () => writeFile(value), {
		preventDefault: true,
		enableOnFormTags: true
	});

	useEffect(() => {
		setValue(file?.content ?? "");
	}, [file]);

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
