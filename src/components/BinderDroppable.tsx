import type { CardInstance } from "../types/scryfall"
import { useDroppable, useDraggable } from "@dnd-kit/react";

type BinderDroppableProps = {
  card: CardInstance | null,
  index: number
  onSelect: (card: CardInstance | null, index: number) => void
  onCtrlClick: (card: CardInstance, index: number) => void
};

function BinderDroppable({card, index, onSelect, onCtrlClick}: BinderDroppableProps) {
    const defaultFace = card?.card.image_uris?.normal;
    const front = card?.card.card_faces?.[0]?.image_uris?.normal;
    const back = card?.card.card_faces?.[1]?.image_uris?.normal;
    const src = (defaultFace ?? (card?.face === "front" ? front : back)) || undefined;


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
                    src={src}
                    alt={card.card.name}
                    style={{ height: "300px", width: "auto", borderRadius: "18px" }}
                    onClick={(e) => {
                        if (e.ctrlKey&& card.card.card_faces?.length === 2) {
                            e.preventDefault();
                            e.stopPropagation();
                            onCtrlClick(card, index);
                            return;
                        }

                        onSelect(card, index);
                    }}
                    />
                ) : null}
                <p>{index}</p>
            </div>
        </>
    )
}

export default BinderDroppable