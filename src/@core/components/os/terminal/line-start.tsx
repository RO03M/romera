import { Row } from "../../ui/row";
import { NodePathTypography } from "./input";
import { UserTypography } from "./user-typography";

interface LineStartProps {
	username?: string;
	path?: string;
	command?: string;
}

export function LineStart(props: LineStartProps) {
	const { username, path, command } = props;

	return (
		<Row sx={{ gap: 0.5 }}>
			{username !== undefined && (
				<Row>
					<UserTypography>{username}</UserTypography>
					<span>:</span>
				</Row>
			)}
			{path !== undefined && <NodePathTypography>{path}</NodePathTypography>}
			{command !== undefined && <span>{command}</span>}
		</Row>
	);
}
