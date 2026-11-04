import { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Columns3, Plus } from "lucide-react";
import type { BoardController } from "../../stores/useBoard";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import CardContent from "./TaskCardContent";
import Column from "./KanbanColumn";
import ColumnDialog from "./ColumnDialog";
import { Button } from "@wekamb/shared-ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@wekamb/shared-ui/dialog";
import { useBoardDrag } from "../hooks/useBoardDrag";

const KanbanBoard = ({ controller }: { controller: BoardController }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { board, addColumn, addCard, moveCard, removeColumn } = controller;
    const drag = useBoardDrag(board, moveCard);
    const reducedMotion = useReducedMotion();

    function closeDialog() {
        setDialogOpen(false);
    }

    return (
        <div className="min-w-0">
            <div className="board-toolbar">
                <div className="min-w-0">
                    <div className="board-eyebrow">
                        <Columns3 size={13} aria-hidden="true" />
                        <span>Fluxo de trabalho</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h2 className="board-title">Seu quadro</h2>
                        <span className="board-summary">
                            {board.columns.length} colunas · {board.cards.length} tarefas
                        </span>
                    </div>
                    <p className="board-instructions">
                        <span className="sm:hidden">Toque e segure uma tarefa para mover.</span>
                        <span className="hidden sm:inline">
                            Arraste as tarefas entre as colunas.
                        </span>
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="board-create">
                            <Plus size={15} aria-hidden="true" />
                            <span>Nova coluna</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="board-dialog">
                        <DialogHeader>
                            <DialogTitle className="text-sm">Criar uma coluna</DialogTitle>
                            <DialogDescription className="text-xs text-zinc-400">
                                Dê um nome para organizar suas tarefas.
                            </DialogDescription>
                        </DialogHeader>
                        <ColumnDialog onAdd={addColumn} onSuccess={closeDialog} />
                    </DialogContent>
                </Dialog>
            </div>

            <DndContext
                sensors={drag.sensors}
                collisionDetection={drag.collisionDetection}
                accessibility={drag.accessibility}
                onDragStart={drag.handleDragStart}
                onDragCancel={drag.handleDragCancel}
                onDragEnd={drag.handleDragEnd}
            >
                {board.columns.length > 0 ? (
                    <div className="kanban-columns">
                        {board.columns.map((column) => (
                            <Column
                                key={column.name}
                                column={column.name}
                                cards={board.cards.filter((card) => card.column === column.name)}
                                onAddCard={addCard}
                                onRemoveColumn={removeColumn}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="kanban-empty">
                        <Columns3
                            size={28}
                            strokeWidth={1.25}
                            className="mb-4 text-zinc-400"
                            aria-hidden="true"
                        />
                        <p className="text-sm font-medium text-zinc-100">
                            Um espaço para organizar suas tarefas.
                        </p>
                        <p className="mt-2 max-w-xs text-xs leading-relaxed text-zinc-400">
                            Crie sua primeira coluna em “Nova coluna” ou adicione um exemplo para
                            começar.
                        </p>
                    </div>
                )}
                <DragOverlay
                    dropAnimation={reducedMotion ? null : { duration: 180, easing: "ease-out" }}
                >
                    {drag.activeCard && (
                        <div className="kanban-task kanban-task-overlay">
                            <CardContent title={drag.activeCard.title} />
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
