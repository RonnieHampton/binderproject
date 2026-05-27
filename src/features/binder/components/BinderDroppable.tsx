import type { CardInstance } from "../state/binderTypes"
import { useDroppable, useDraggable } from "@dnd-kit/react";
import styles from "./BinderDroppable.module.css";

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
                className={styles.binderSlot}
                ref={ref}
                >
                {card ? (
                    <img
                    className={styles.binderSlotImage}
                    src={src}
                    alt={card.card.name}
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
                <p className={styles.slotIndex}>{index}</p>
            </div>
        </>
    )
}

export default BinderDroppable
