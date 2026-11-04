import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@wekamb/shared-ui/button";
import { Textarea } from "@wekamb/shared-ui/textarea";

type TaskComposerProps = {
    column: string;
    onAdd: (column: string, title: string) => void;
};

const TaskComposer = ({ column, onAdd }: TaskComposerProps) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);
    const inputId = useId();

    function close() {
        setAdding(false);
        setText("");
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!text.trim()) {
            return;
        }

        onAdd(column, text);
        close();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Escape") {
            close();
        }
    }

    if (adding) {
        return (
            <form onSubmit={handleSubmit} className="task-composer">
                <label htmlFor={inputId} className="sr-only">
                    Nova tarefa em {column}
                </label>
                <Textarea
                    id={inputId}
                    className="min-h-28 resize-y border-0 bg-transparent p-1 text-base leading-5 text-zinc-100 shadow-none placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-500 sm:text-[13px]"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    required
                    maxLength={2000}
                    placeholder="O que precisa ser feito?"
                />
                <div className="mt-3 flex flex-wrap justify-end gap-1.5">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-xs text-zinc-300"
                        onClick={close}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" className="text-xs" disabled={!text.trim()}>
                        Adicionar
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <Button type="button" variant="ghost" className="task-add" onClick={() => setAdding(true)}>
            <Plus size={14} aria-hidden="true" />
            <span>Adicionar tarefa</span>
        </Button>
    );
};

export default TaskComposer;
