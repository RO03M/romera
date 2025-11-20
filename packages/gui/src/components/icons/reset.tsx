import { IconProps } from "./icon-props";

export function ResetIcon(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size}
            height={props.size}
            viewBox="0 0 20 20"
        >
            <g
                fill="none"
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
            >
                <path d="M3.578 6.487A8 8 0 1 1 2.5 10.5" />
                <path d="M7.5 6.5h-4v-4" />
            </g>
        </svg>

    )
}