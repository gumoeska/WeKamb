import { Dispatch, DragEvent, SetStateAction, useState } from "react";
import { CardType } from "../../types";
import AddCard from "../Card/AddCard";
import CardComp from "../Card";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { MdDelete } from "react-icons/md";

type ColumnProps = {
    title: string,
    headingColor: string,
    column: string,
    cards: any[],
    setCards: Dispatch<SetStateAction<any[]>>,
    setColumns: Dispatch<SetStateAction<any[]>>
}

type IndexSet = {
    offset: number,
    element: HTMLElement,
}

const Column = ({ title, headingColor, column, cards, setCards, setColumns }: ColumnProps) => {
    const [active, setActive] = useState<boolean>(false);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, card: CardType) => {
        e.dataTransfer.setData("cardId", card.id);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const getNearestIndicator = (
        e: React.DragEvent<HTMLDivElement>,
        indicators: HTMLElement[]
    ): IndexSet => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce(
            (closest: IndexSet, child: HTMLElement) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return el;
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const cardId = e.dataTransfer.getData("cardId");

        setActive(false);

        const indicators: HTMLElement[] = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element?.dataset.before || "-1";

        if (before !== cardId) {
            let copy = [...cards];
            let cardToTransfer = copy.find((c) => c.id === cardId);
            if (!cardToTransfer) return;
            cardToTransfer = { ...cardToTransfer, column };

            copy = copy.filter((c) => c.id !== cardId);

            const moveToBack = before === "-1";

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);
                if (insertAtIndex === -1) return;

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            setCards(copy);
        }
    };

    const getIndicators = (): HTMLElement[] => {
        return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
    };

    const filteredCards = cards.filter((x) => x.column === column);

    const removeColumn = (columnToRemove: string) => {
        setColumns((c) => c.filter(col => col.name !== columnToRemove));
        setCards((x) => x.filter(y => y.column !== columnToRemove));
    }

    return (
        <div className="grid grid-rows-2">
            <Card onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDragEnd} className={`bg-black p-4 w-full transition-colors ${active ? "bg-zinc-800/10" : "bg-zinc-800/0"}`}>
                <div className="w-56">
                    <CardHeader className="p-0 border-b">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className={`font-medium ${headingColor}`}>
                                {title}
                            </h3>
                            <span className="rounded text-sm text-zinc-400">
                                {filteredCards.length}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 py-5">
                        <div>
                            {filteredCards.map((x) => {
                                return <CardComp key={x.id} {...x} handleDragStart={handleDragStart} />
                            })}
                            <AddCard column={column} setCards={setCards} />
                        </div>
                    </CardContent>
                </div>
            </Card>
            <div className="flex flex-col py-3">
                <Button variant={'outline'} className="bg-black hover:bg-red-500/60" onClick={() => removeColumn(column)}>
                    <MdDelete size={20} />
                </Button>
            </div>
        </div>
    );
}

export default Column;