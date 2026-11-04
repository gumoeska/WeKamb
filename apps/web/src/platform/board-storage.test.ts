import assert from "node:assert/strict";
import { test } from "node:test";
import { BOARD_STORAGE_KEY } from "@wekamb/bridge-contract";
import type { BoardData } from "@wekamb/shared-domain";
import { createBoardRepository } from "./board-storage";

const board: BoardData = {
    columns: [{ name: "Backlog" }],
    cards: [{ id: "a", title: "Primeira tarefa", column: "Backlog" }],
};

function memoryStorage(values: Record<string, string> = {}) {
    const data = new Map(Object.entries(values));

    return {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => {
            data.set(key, value);
        },
    };
}

test("opens an empty board when no saved data exists", () => {
    const repository = createBoardRepository(memoryStorage());

    assert.deepEqual(repository.load(), { board: { cards: [], columns: [] }, error: null });
});

test("loads legacy data without modifying it", () => {
    const storage = memoryStorage({
        cards: JSON.stringify(board.cards),
        columns: JSON.stringify(board.columns),
    });

    assert.deepEqual(createBoardRepository(storage).load(), { board, error: null });
    assert.equal(storage.getItem(BOARD_STORAGE_KEY), null);
    assert.equal(storage.getItem("cards"), JSON.stringify(board.cards));
});

test("saves one versioned document and prefers it over legacy data", () => {
    const storage = memoryStorage({ cards: "broken legacy data" });
    const repository = createBoardRepository(storage);

    assert.equal(repository.save(board), null);
    assert.deepEqual(JSON.parse(storage.getItem(BOARD_STORAGE_KEY)!), { version: 1, board });
    assert.deepEqual(repository.load(), { board, error: null });
    assert.equal(storage.getItem("cards"), "broken legacy data");
});

test("recovers from invalid JSON without overwriting it", () => {
    const storage = memoryStorage({ [BOARD_STORAGE_KEY]: "{broken" });
    const result = createBoardRepository(storage).load();

    assert.deepEqual(result.board, { cards: [], columns: [] });
    assert.ok(result.error);
    assert.equal(storage.getItem(BOARD_STORAGE_KEY), "{broken");
});

test("rejects unsupported versions, invalid shapes, and orphan cards", () => {
    for (const value of [
        null,
        [],
        { version: 2, board },
        { version: 1, board: { cards: {}, columns: [] } },
        { version: 1, board: { ...board, columns: [] } },
    ]) {
        const storage = memoryStorage({ [BOARD_STORAGE_KEY]: JSON.stringify(value) });

        assert.ok(createBoardRepository(storage).load().error);
        assert.equal(storage.getItem(BOARD_STORAGE_KEY), JSON.stringify(value));
    }
});

test("storage access and quota errors return feedback instead of throwing", () => {
    const repository = createBoardRepository({
        getItem: () => {
            throw new Error("Access denied");
        },
        setItem: () => {
            throw new Error("Quota exceeded");
        },
    });

    assert.ok(repository.load().error);
    assert.ok(repository.save(board));
});
