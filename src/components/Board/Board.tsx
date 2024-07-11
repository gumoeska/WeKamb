import { useEffect, useState } from "react";
import Column from "../Column";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { IoIosAdd } from "react-icons/io";
import ColumnDialog from "../ColumnDialog";

const Board = () => {
    const [cards, setCards] = useState<any>([]);
    const [columns, setColumns] = useState<any>([]);
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
        checked && localStorage.setItem("cards", JSON.stringify(cards));
        checked && localStorage.setItem("columns", JSON.stringify(columns));
    }, [cards, columns]);

    useEffect(() => {
        const cardData = localStorage.getItem("cards");
        const columnsData = localStorage.getItem("columns");

        setCards(cardData ? JSON.parse(cardData) : []);
        setColumns(columnsData ? JSON.parse(columnsData) : []);

        setChecked(true);
    }, []);

    return (
        <div className="pt-32 min-w-max bg-black">
            <Dialog>
                <DialogTrigger className="fixed p-5 m-5 bottom-28 right-16 z-50 rounded-full size-18 border-0 animate-bounce hover:animate-spin bg-zinc-950">
                    <IoIosAdd size={20} />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar uma Coluna</DialogTitle>
                        <DialogDescription>
                            A coluna é necessária para adicionar suas tarefas.
                        </DialogDescription>
                    </DialogHeader>
                    <ColumnDialog setColumns={setColumns} />
                </DialogContent>
            </Dialog>

            <div className="flex flex-row gap-8 overflow-scroll">
                {columns.length > 0 ? (columns.map((e: any) => {
                    return (
                        <Column
                            title={e.name}
                            column={e.name}
                            headingColor="text-zinc-500"
                            cards={cards}
                            setCards={setCards}
                            setColumns={setColumns}
                        />
                    );
                })) : (
                    <div className="flex flex-row items-center justify-center mt-28">
                        <p className="leading-7 [&:not(:first-child)]:mt-6 text-zinc-500">
                            Você ainda não criou nenhuma coluna, comece clicando em '+'
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Board;