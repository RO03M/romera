import { Row } from "../../ui/row";
import { NodePathTypography } from "./input";
import { UserTypography } from "./user-typography";

interface LineStartProps {
    username: string;
    path: string;
    command?: string;
}

export function LineStart(props: LineStartProps) {
    const { username, path, command } = props;

    return (
        <Row sx={{ gap: 0.5 }}>
            <Row>
                <UserTypography>{username}</UserTypography>
                <span>:</span>
            </Row>
            <NodePathTypography>{path}</NodePathTypography>
            <span>
                {command}
            </span>
        </Row>
    )
}