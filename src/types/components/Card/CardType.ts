import { DragEvent } from "react";

export type CardType = {
    title: string,
    id: string,
    column: string,
    handleDragStart: (e: DragEvent<HTMLDivElement>, card: BaseCardType) => void;
}

export type BaseCardType = {
    title: string,
    id: string,
    column: string,
}