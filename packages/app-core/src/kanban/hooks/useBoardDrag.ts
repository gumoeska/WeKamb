import { useState } from "react";
import {
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCorners,
    pointerWithin,
    useSensor,
    useSensors,
    type Announcements,
    type CollisionDetection,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import type { BoardData } from "@wekamb/shared-domain";
import { keyboardCoordinates } from "./keyboardCoordinates";

type MoveCard = (id: string, column: string, beforeId?: string) => void;

const collisionDetection: CollisionDetection = (args) => {
    if (!args.pointerCoordinates) {
        return closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
                (container) =>
                    String(container.id).startsWith("card:") || container.data.current?.empty,
            ),
        });
    }

    const collisions = pointerWithin(args);
    const card = collisions.find(({ id }) => String(id).startsWith("card:"));

    return card ? [card] : collisions;
};

export function useBoardDrag(board: BoardData, moveCard: MoveCard) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: keyboardCoordinates }),
    );

    function handleDragStart({ active }: DragStartEvent) {
        setActiveId(String(active.id).slice("card:".length));
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    function handleDragEnd({ active, over, activatorEvent }: DragEndEvent) {
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        const cardId = String(active.id).slice("card:".length);

        if (String(over.id).startsWith("column:")) {
            moveCard(cardId, String(over.id).slice("column:".length));
            return;
        }

        const target = board.cards.find((card) => `card:${card.id}` === over.id);

        if (!target) {
            return;
        }

        const translated = active.rect.current.translated;
        const source = board.cards.find((card) => card.id === cardId);
        const isAfterTarget =
            activatorEvent.type === "keydown"
                ? source?.column === target.column &&
                  board.cards.indexOf(source) < board.cards.indexOf(target)
                : translated !== null &&
                  translated.top + translated.height / 2 > over.rect.top + over.rect.height / 2;
        const destinationCards = board.cards.filter(
            (card) => card.column === target.column && card.id !== cardId,
        );
        const targetIndex = destinationCards.findIndex((card) => card.id === target.id);
        const nextCard = destinationCards[targetIndex + 1];

        moveCard(cardId, target.column, isAfterTarget ? nextCard?.id : target.id);
    }

    const announcements: Announcements = {
        onDragStart: () => "Tarefa selecionada. Use as setas para mover.",
        onDragOver: ({ over }) => {
            if (!over) {
                return "Fora de uma área de destino.";
            }

            const target = board.cards.find((card) => `card:${card.id}` === over.id);

            if (target) {
                return `Destino: coluna ${target.column}, tarefa ${target.title}.`;
            }

            return `Destino: coluna ${String(over.id).slice("column:".length)}.`;
        },
        onDragEnd: ({ over }) => (over ? "Tarefa movida." : "Movimentação cancelada."),
        onDragCancel: () => "Movimentação cancelada.",
    };

    return {
        activeCard: board.cards.find((card) => card.id === activeId),
        sensors,
        collisionDetection,
        handleDragStart,
        handleDragCancel,
        handleDragEnd,
        accessibility: {
            announcements,
            screenReaderInstructions: {
                draggable:
                    "Para mover uma tarefa, pressione espaço. Use as setas para escolher a posição, espaço para soltar ou Escape para cancelar.",
            },
        },
    };
}
