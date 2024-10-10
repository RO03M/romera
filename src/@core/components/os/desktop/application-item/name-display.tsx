import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "preact/hooks";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";
import { filename } from "../../../../filesystem/utils/path";

interface NameDisplayProps {
	focused: boolean;
	value: string;
}

export function NameDisplay(props: NameDisplayProps) {
	const { value: _value, focused = false } = props;

	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(_value.replace(/^\//, ""));
	const editorRef = useRef<HTMLTextAreaElement | null>(null);

	const onF2 = useCallback(() => {
		if (!focused) {
			return;
		}
		setEditing(true);
	}, [focused]);

	const onKeyPress = useCallback((event: KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault();
			setEditing(false);
		}
	}, []);

	useHotkeys("f2", onF2);
	useHotkeys("esc", () => setEditing(false));

	useEffect(() => {
		if (!focused) {
			setEditing(false);
		}
	}, [focused]);

	useEffect(() => {
		if (!editing || editorRef.current === null) {
			return;
		}

		editorRef.current.focus();
		const currentValue = editorRef.current.value;
		const filenameWithoutExtension = filename(currentValue);
		const startIndex = currentValue.indexOf(filenameWithoutExtension);

		editorRef.current.setSelectionRange(
			startIndex,
			startIndex + filenameWithoutExtension.length
		);
	}, [editing]);

	if (!editing) {
		return <span>{value}</span>;
	}

	return (
		<NameEditor
			ref={editorRef}
			onChange={(event) => setValue(event.currentTarget.value)}
			onKeyPress={onKeyPress}
			value={value}
		/>
	);
}

const NameEditor = styled.textarea({
	backgroundColor: "#fff",
	color: "#000",
	resize: "none",
	width: "80%"
});
