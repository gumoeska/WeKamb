import type { SVGProps } from "react";

export function KanbanMark(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
            <rect
                x="1"
                y="1"
                width="38"
                height="38"
                rx="3"
                fill="var(--surface-page, #080808)"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path d="M8 9h6v13H8zM17 9h6v22h-6zM26 9h6v17h-6z" fill="currentColor" />
        </svg>
    );
}
