import { useSortable } from "@dnd-kit/sortable";
import type { CardData } from "@wekamb/shared-domain";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import CardContent from "./TaskCardContent";

const TaskCard = ({ title, id }: CardData) => {
    const reducedMotion = useReducedMotion();
    const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
        id: `card:${id}`,
        transition: reducedMotion ? null : { duration: 180, easing: "ease" },
    });
    const style = {
        transform:
            !isDragging && transform
                ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`
                : undefined,
        transition: transition
            ? `${transition}, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease`
            : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            data-dragging={isDragging}
            aria-label={`Mover tarefa: ${title}`}
            className="kanban-task"
        >
            <CardContent title={title} />
        </div>
    );
};

export default TaskCard;
