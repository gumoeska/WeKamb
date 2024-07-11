import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";

type AddCardProps = {
    column: string,
    setCards: Dispatch<SetStateAction<any[]>>
}

const AddCard = ({ column, setCards }: AddCardProps) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString()
        };

        setCards((pv) => [...pv, newCard]);
        setAdding(false);
    }

    return (
        <>
            {adding ? (
                <form onSubmit={handleSubmit}>
                    <Textarea
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder="Adicione uma nova tarefa..."
                    />
                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                        <Button variant={'ghost'} onClick={() => setAdding(false)}>
                            Fechar
                        </Button>
                        <Button variant={'outline'} type="submit" className="bg-black">
                            Adicionar
                        </Button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-50">
                    <span>Adicionar task</span>
                    <IoIosAdd size={15} />
                </button>
            )}
        </>
    );
}

export default AddCard;