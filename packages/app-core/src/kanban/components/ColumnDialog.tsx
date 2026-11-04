import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { DialogClose } from "@wekamb/shared-ui/dialog";
import { Button } from "@wekamb/shared-ui/button";
import { Input } from "@wekamb/shared-ui/input";

type ColumnDialogProps = {
    onAdd: (name: string) => string | null;
    onSuccess: () => void;
};

const ColumnDialog = ({ onAdd, onSuccess }: ColumnDialogProps) => {
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const inputId = useId();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const message = onAdd(text);

        setError(message);

        if (!message) {
            onSuccess();
        }
    };

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
        setError(null);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor={inputId} className="text-xs text-zinc-200">
                Nome da coluna
            </label>
            <Input
                id={inputId}
                className="my-4 text-base sm:text-[13px]"
                value={text}
                onChange={handleChange}
                required
                maxLength={100}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
            />
            {error && (
                <p id={`${inputId}-error`} role="alert" className="mb-4 text-sm text-zinc-100">
                    {error}
                </p>
            )}
            <div className="flex justify-end gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="text-xs">
                        Cancelar
                    </Button>
                </DialogClose>
                <Button
                    type="submit"
                    variant="secondary"
                    className="text-xs"
                    disabled={!text.trim()}
                >
                    Adicionar
                </Button>
            </div>
        </form>
    );
};

export default ColumnDialog;
