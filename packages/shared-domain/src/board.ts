export type CardData = { id: string; title: string; column: string };
export type ColumnData = { name: string };
export type BoardData = { cards: CardData[]; columns: ColumnData[] };

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function isBoardData(value: unknown): value is BoardData {
    if (!isRecord(value) || !Array.isArray(value.cards) || !Array.isArray(value.columns)) {
        return false;
    }

    const names = new Set<string>();

    for (const column of value.columns) {
        if (!isRecord(column) || !isNonEmptyString(column.name) || names.has(column.name)) {
            return false;
        }

        names.add(column.name);
    }

    const ids = new Set<string>();

    for (const card of value.cards) {
        if (
            !isRecord(card) ||
            !isNonEmptyString(card.id) ||
            !isNonEmptyString(card.title) ||
            typeof card.column !== "string" ||
            !names.has(card.column) ||
            ids.has(card.id)
        ) {
            return false;
        }

        ids.add(card.id);
    }

    return true;
}

export function moveCard(
    board: BoardData,
    cardId: string,
    column: string,
    beforeId?: string,
): BoardData {
    const card = board.cards.find((item) => item.id === cardId);

    if (!card || !board.columns.some((item) => item.name === column) || beforeId === cardId) {
        return board;
    }

    if (beforeId && !board.cards.some((item) => item.id === beforeId && item.column === column)) {
        return board;
    }

    const cards = board.cards.filter((item) => item.id !== cardId);
    const index = beforeId ? cards.findIndex((item) => item.id === beforeId) : cards.length;

    cards.splice(index, 0, { ...card, column });

    return { ...board, cards };
}

export function removeColumn(board: BoardData, name: string): BoardData {
    return {
        columns: board.columns.filter((column) => column.name !== name),
        cards: board.cards.filter((card) => card.column !== name),
    };
}

export function addExamples(board: BoardData, createId: () => string): BoardData {
    const examples = [
        {
            name: "Backlog",
            titles: [
                "Criar um botão",
                "Criar uma tabela",
                "Refatorar componente",
                "Ajustar validações",
                "Criar nova página",
            ],
        },
        {
            name: "Desenvolvendo",
            titles: ["Refatorar método", "Corrigir bug", "Adicionar um novo componente"],
        },
        {
            name: "Testando",
            titles: [
                "Adicionar novo botão em um componente existente",
                "Criar colunas no banco de dados",
            ],
        },
        {
            name: "Finalizado",
            titles: ["Criar tabela no banco de dados", "Criar CRUD", "Adicionar novas validações"],
        },
    ];

    const existingNames = new Set(board.columns.map((column) => column.name));
    const newColumns = examples
        .filter(({ name }) => !existingNames.has(name))
        .map(({ name }) => ({ name }));
    const newCards = examples.flatMap(({ name, titles }) =>
        titles.map((title) => ({ id: createId(), title, column: name })),
    );

    return {
        columns: [...board.columns, ...newColumns],
        cards: [...board.cards, ...newCards],
    };
}
