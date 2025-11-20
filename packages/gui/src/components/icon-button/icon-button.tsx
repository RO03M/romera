import { ReactNode } from "preact/compat";
import styles from "./icon-button.module.css";

interface IconButtonProps {
    icon: ReactNode;
    onClick?: (event: MouseEvent) => void;
}

export function IconButton(props: IconButtonProps) {
    return (
        <button
            className={styles["icon-button"]}
            onClick={props.onClick}
        >
            {props.icon}
        </button>
    );
}