import type { KeyboardCoordinateGetter } from "@dnd-kit/core";

const directions = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export const keyboardCoordinates: KeyboardCoordinateGetter = (event, { context }) => {
    const { active, over, collisionRect, droppableContainers, droppableRects } = context;

    if (!active || !collisionRect || !directions.has(event.code)) {
        return;
    }

    event.preventDefault();

    const origin = over ? (droppableRects.get(over.id) ?? collisionRect) : collisionRect;
    const horizontal = event.code === "ArrowLeft" || event.code === "ArrowRight";
    const forward = event.code === "ArrowRight" || event.code === "ArrowDown";
    let closest: { x: number; y: number } | undefined;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const container of droppableContainers.getEnabled()) {
        if (container.id === active.id) {
            continue;
        }

        if (String(container.id).startsWith("column:") && !container.data.current?.empty) {
            continue;
        }

        const rect = droppableRects.get(container.id);

        if (!rect) {
            continue;
        }

        const dx = rect.left - origin.left;
        const dy = rect.top - origin.top;
        const primary = horizontal ? dx : dy;
        const secondary = horizontal ? dy : dx;

        if ((forward && primary <= 1) || (!forward && primary >= -1)) {
            continue;
        }

        const distance = Math.abs(primary) + Math.abs(secondary) * 2;

        if (distance < closestDistance) {
            closestDistance = distance;
            closest = { x: rect.left, y: rect.top };
        }
    }

    return closest;
};
