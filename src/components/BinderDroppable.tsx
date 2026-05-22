import type { CardInstance } from "../types/scryfall"
import { useDroppable, useDraggable } from "@dnd-kit/react";

type BinderDroppableProps = {
  card: CardInstance | null,
  index: number
  onSelect: (card: CardInstance | null, index: number) => void
};

function BinderDroppable({card, index, onSelect}: BinderDroppableProps) {
    const {ref: droppableRef} = useDroppable({
        id: `drop-${index}`,
        type: "binder-droppable", 
        data: { index, card }
    });

    const {ref: draggableRef} = useDraggable({
        id: `drag-${index}`,
        data: { index, card },
        type: "binder-draggable",
        disabled: !card
    });

    const ref = (node: HTMLElement | null) => {
            droppableRef(node);
            draggableRef(node);
    };

    console.log(card?.card.prints_search_uri);

    return(
        <>
            <div
                ref={ref}
                style={{
                    height: "300px",
                    width: "215px",
                    backgroundColor: "gray",
                    borderRadius: "8px",
                }}
                >
                {card ? (
                    <img
                    src={card.card.image_uris?.normal}
                    alt={card.card.name}
                    style={{ height: "300px", width: "auto", borderRadius: "18px" }}
                    onClick={() => onSelect(card, index)}
                    />
                ) : null}
                <p>{index}</p>
            </div>
        </>
    )
}

export default BinderDroppable