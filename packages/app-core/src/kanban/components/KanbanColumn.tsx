import { useDndContext, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Trash2 } from "lucide-react";
import type { CardData } from "@wekamb/shared-domain";
import TaskComposer from "./TaskComposer";
import TaskCard from "./TaskCard";
import { Button } from "@wekamb/shared-ui/button";

type KanbanColumnProps = {
    column: string;
    cards: CardData[];
    onAddCard: (column: string, title: string) => void;
    onRemoveColumn: (column: string) => void;
};

const KanbanColumn = ({ column, cards, onAddCard, onRemoveColumn }: KanbanColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `column:${column}`,
        data: { empty: cards.length === 0 },
    });
    const { over } = useDndContext();
    const isTarget = isOver || cards.some((card) => `card:${card.id}` === over?.id);

    return (
        <section
            aria-label={`Coluna ${column}`}
            className="kanban-column"
            data-drop-target={isTarget}
        >
            <div className="column-header">
                <span className="column-marker" aria-hidden="true" />
                <h3 className="column-title">{column}</h3>
                <span className="column-count" aria-label={`${cards.length} tarefas`}>
                    {cards.length}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="column-delete"
                    aria-label={`Excluir coluna ${column} e suas tarefas`}
                    onClick={() => onRemoveColumn(column)}
                >
                    <Trash2 size={14} aria-hidden="true" />
                </Button>
            </div>
            <div ref={setNodeRef} className="kanban-column-body">
                <SortableContext
                    id={`column:${column}`}
                    items={cards.map((card) => `card:${card.id}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {cards.map((card) => (
                        <TaskCard key={card.id} {...card} />
                    ))}
                </SortableContext>
                {cards.length === 0 && (
                    <div className="column-empty">
                        <p className="text-center text-xs text-zinc-400">
                            Arraste uma tarefa para cá
                        </p>
                    </div>
                )}
                <TaskComposer column={column} onAdd={onAddCard} />
            </div>
        </section>
    );
};

export default KanbanColumn;
