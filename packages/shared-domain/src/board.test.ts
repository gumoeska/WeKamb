import assert from "node:assert/strict";
import { test } from "node:test";
import { addExamples, isBoardData, moveCard, removeColumn, type BoardData } from "./index";

const createBoard = (): BoardData => ({
    columns: [{ name: "Backlog" }, { name: "Em andamento" }],
    cards: [
        { id: "a", title: "Primeira", column: "Backlog" },
        { id: "b", title: "Segunda", column: "Backlog" },
        { id: "c", title: "Terceira", column: "Em andamento" },
    ],
});

test("rejects duplicate identifiers, invalid titles, duplicate columns, and orphan cards", () => {
    const board = createBoard();

    assert.ok(isBoardData(board));
    assert.equal(isBoardData({ ...board, cards: [board.cards[0], board.cards[0]] }), false);
    assert.equal(isBoardData({ ...board, columns: [board.columns[0], board.columns[0]] }), false);
    assert.equal(
        isBoardData({ ...board, cards: [{ ...board.cards[0], column: "Missing" }] }),
        false,
    );
    assert.equal(isBoardData({ ...board, cards: [{ ...board.cards[0], title: "   " }] }), false);
});

test("reorders a card without mutating the board", () => {
    const original = createBoard();
    const snapshot = structuredClone(original);
    const moved = moveCard(original, "b", "Backlog", "a");

    assert.deepEqual(
        moved.cards.filter((card) => card.column === "Backlog").map((card) => card.id),
        ["b", "a"],
    );
    assert.deepEqual(original, snapshot);
});

test("moves between columns at the correct insertion point", () => {
    const moved = moveCard(createBoard(), "b", "Em andamento", "c");

    assert.deepEqual(
        moved.cards.filter((card) => card.column === "Em andamento").map((card) => card.id),
        ["b", "c"],
    );
    assert.equal(moved.cards.filter((card) => card.id === "b").length, 1);
});

test("supports dropping at the end and into empty columns", () => {
    const board = createBoard();
    const empty = { ...board, columns: [...board.columns, { name: "Vazia" }] };

    assert.deepEqual(
        moveCard(board, "a", "Backlog")
            .cards.filter((card) => card.column === "Backlog")
            .map((card) => card.id),
        ["b", "a"],
    );
    assert.equal(
        moveCard(empty, "a", "Vazia").cards.find((card) => card.id === "a")?.column,
        "Vazia",
    );
});

test("ignores invalid drag payloads and destinations", () => {
    const board = createBoard();

    for (const [id, column, before] of [
        ["missing", "Backlog", undefined],
        ["a", "Missing", undefined],
        ["a", "Backlog", "a"],
        ["a", "Backlog", "c"],
        ["a", "Backlog", "missing"],
    ]) {
        assert.equal(moveCard(board, id!, column!, before), board);
    }
});

test("treats column names containing selector characters as plain data", () => {
    const name = 'Coluna ["especial"]';
    const board = { ...createBoard(), columns: [...createBoard().columns, { name }] };

    assert.equal(moveCard(board, "a", name).cards.find((card) => card.id === "a")?.column, name);
});

test("removing a column removes only its cards", () => {
    const board = createBoard();
    const result = removeColumn(board, "Backlog");

    assert.deepEqual(result.columns, [{ name: "Em andamento" }]);
    assert.deepEqual(result.cards, [board.cards[2]]);
    assert.equal(board.cards.length, 3);
});

test("examples preserve tasks and use an injected identifier generator", () => {
    const original = createBoard();
    let nextId = 0;
    const createId = () => `example-${++nextId}`;
    const result = addExamples(addExamples(original, createId), createId);

    assert.deepEqual(result.cards.slice(0, original.cards.length), original.cards);
    assert.equal(result.columns.filter((column) => column.name === "Backlog").length, 1);
    assert.equal(result.cards.length, original.cards.length + 26);
    assert.equal(new Set(result.cards.map((card) => card.id)).size, result.cards.length);
    assert.ok(isBoardData(result));
});
