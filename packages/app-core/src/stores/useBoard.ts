import { useEffect, useState } from "react";
import {
    addExamples,
    moveCard as moveBoardCard,
    removeColumn as removeBoardColumn,
} from "@wekamb/shared-domain";
import type { WekambBridge } from "@wekamb/bridge-contract";

export function useBoard(bridge: WekambBridge) {
    const [initial] = useState(() => bridge.board.load());
    const [board, setBoard] = useState(initial.board);
    const [storageError, setStorageError] = useState(initial.error);

    useEffect(() => {
        if (board === initial.board) {
            return;
        }

        setStorageError(bridge.board.save(board));
    }, [board, initial, bridge]);

    function addColumn(name: string) {
        const trimmed = name.trim();
        const normalized = trimmed.toLocaleLowerCase("pt-BR");

        if (!trimmed) {
            return "Informe um nome para a coluna.";
        }

        const exists = board.columns.some(
            (column) => column.name.toLocaleLowerCase("pt-BR") === normalized,
        );

        if (exists) {
            return "Já existe uma coluna com esse nome.";
        }

        setBoard((current) => ({
            ...current,
            columns: [...current.columns, { name: trimmed }],
        }));

        return null;
    }

    function addCard(column: string, title: string) {
        const trimmed = title.trim();

        if (!trimmed) {
            return;
        }

        const card = { id: bridge.createId(), column, title: trimmed };

        setBoard((current) => {
            if (!current.columns.some((item) => item.name === column)) {
                return current;
            }

            return { ...current, cards: [...current.cards, card] };
        });
    }

    function moveCard(id: string, column: string, beforeId?: string) {
        setBoard((current) => moveBoardCard(current, id, column, beforeId));
    }

    function removeColumn(name: string) {
        setBoard((current) => removeBoardColumn(current, name));
    }

    function loadExamples() {
        setBoard((current) => addExamples(current, bridge.createId));
    }

    return {
        board,
        storageError,
        addColumn,
        addCard,
        moveCard,
        removeColumn,
        loadExamples,
    };
}

export type BoardController = ReturnType<typeof useBoard>;
