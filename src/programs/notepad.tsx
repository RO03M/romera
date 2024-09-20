import { styled } from "@mui/material";
import { useHotkeys } from "react-hotkeys-hook";
import { useFile } from "../@core/filesystem/hooks/use-file";

interface NotepadProps {
	filePath?: string;
}

export function Notepad(props: NotepadProps) {
	const { filePath } = props;

	const { file } = useFile(filePath);

	useHotkeys("ctrl+s", () => console.log("asdasd"), {
		preventDefault: true,
		enableOnFormTags: true
	});

	return (
		<Wrapper>
			<EditArea value={file?.content ?? ""} />
		</Wrapper>
	);
}

const Wrapper = styled<"div">("div", { label: "notepad" })({
	display: "flex",
	flexDirection: "column",
	height: "100%"
});

const EditArea = styled<"textarea">("textarea")({
	resize: "none",
	outline: "none",
	border: "none",
	flex: 1
});
