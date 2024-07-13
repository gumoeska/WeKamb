import { CardType } from "../../types";

const Card = ({ title, id, column, handleDragStart }: CardType) => {
    return (
        <>
            <div draggable 
                 onDragStart={(e) => handleDragStart(e, { title, id, column })} 
                 className="flex flex-row justify-between items-center cursor-grab rounded border border-zinc-850 bg-black p-4 my-2 active:cursor-grabbing">
                <p className="text-sm text-zinc-100">
                    {title}
                </p>
            </div>
        </>
    );
}

export default Card;