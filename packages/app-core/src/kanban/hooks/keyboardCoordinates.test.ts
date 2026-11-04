import assert from "node:assert/strict";
import { test } from "node:test";
import type { KeyboardCoordinateGetter } from "@dnd-kit/core";
import { keyboardCoordinates } from "./keyboardCoordinates";

type Target = {
    id: string;
    left: number;
    top: number;
    empty?: boolean;
};

function navigate(code: string, targets: Target[], overlayOffset = 0) {
    let prevented = false;
    const origin = { left: 100, top: 100 };
    const event = {
        code,
        preventDefault: () => {
            prevented = true;
        },
    } as KeyboardEvent;
    const context = {
        active: { id: "card:active" },
        over: { id: "card:active" },
        collisionRect: { left: origin.left + overlayOffset, top: origin.top + overlayOffset },
        droppableRects: new Map([
            ["card:active", origin],
            ...targets.map(
                (target) => [target.id, { left: target.left, top: target.top }] as const,
            ),
        ]),
        droppableContainers: {
            getEnabled: () =>
                targets.map((target) => ({
                    id: target.id,
                    data: { current: { empty: target.empty } },
                })),
        },
    };
    const args = { context } as unknown as Parameters<KeyboardCoordinateGetter>[1];

    return { coordinates: keyboardCoordinates(event, args), prevented };
}

test("moves right without treating a rotated overlay as a different column", () => {
    const result = navigate(
        "ArrowRight",
        [
            { id: "card:below", left: 100, top: 240 },
            { id: "card:right", left: 400, top: 100 },
        ],
        -1.7,
    );

    assert.deepEqual(result.coordinates, { x: 400, y: 100 });
    assert.equal(result.prevented, true);
});

test("moves vertically to the next card in the same column", () => {
    const result = navigate("ArrowDown", [
        { id: "card:below", left: 100, top: 240 },
        { id: "card:diagonal", left: 400, top: 200 },
    ]);

    assert.deepEqual(result.coordinates, { x: 100, y: 240 });
});

test("supports moving up and left", () => {
    const targets = [
        { id: "card:above", left: 100, top: 0 },
        { id: "card:left", left: 0, top: 100 },
    ];

    assert.deepEqual(navigate("ArrowUp", targets).coordinates, { x: 100, y: 0 });
    assert.deepEqual(navigate("ArrowLeft", targets).coordinates, { x: 0, y: 100 });
});

test("uses empty columns as destinations without targeting occupied column containers", () => {
    const result = navigate("ArrowRight", [
        { id: "column:occupied", left: 110, top: 100, empty: false },
        { id: "column:empty", left: 400, top: 100, empty: true },
    ]);

    assert.deepEqual(result.coordinates, { x: 400, y: 100 });
});

test("does not move when no destination exists in the requested direction", () => {
    const result = navigate("ArrowRight", [{ id: "card:left", left: 0, top: 100 }]);

    assert.equal(result.coordinates, undefined);
});

test("does not intercept keys that are not directional controls", () => {
    const result = navigate("Tab", [{ id: "card:right", left: 400, top: 100 }]);

    assert.equal(result.coordinates, undefined);
    assert.equal(result.prevented, false);
});
