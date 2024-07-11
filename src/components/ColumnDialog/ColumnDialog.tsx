import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

type ColumnDialogProps = {
    setColumns: Dispatch<SetStateAction<any[]>>
}

const ColumnDialog = ({ setColumns }: ColumnDialogProps) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newColumn = {
            name: text.trim(),
        };

        setColumns((c) => [...c, newColumn]);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input className="my-4" placeholder="Nome da Coluna" onChange={(e) => setText(e.target.value)} />
            <div className="flex flex-row justify-end">
                <div className="mr-1">
                    <DialogClose asChild>
                        <Button variant={'outline'}>Cancelar</Button>
                    </DialogClose>
                </div>
                <div className="ml-1">
                    <DialogClose>
                        <Button type="submit" variant={'secondary'}>Adicionar</Button>
                    </DialogClose>
                </div>
            </div>
        </form>
    );
}

export default ColumnDialog