import { useDraggable } from "@dnd-kit/react";
import type { CardInstance } from "../state/binderTypes";
import styles from "./BinderCard.module.css";

// TODO(refactor): Legacy card component. Move behavior into cards/components/BinderCard and rendering into DisplayCard.
type BinderCardProps = {
  card: CardInstance;
  index: number;
  onSelect: (card: CardInstance, index: number) => void;
  onCtrlClick: (card: CardInstance, index: number) => void;
};

function BinderCard({ card, index, onSelect, onCtrlClick }: BinderCardProps) {
  const { ref } = useDraggable({
    id: `${index}-${card.id}`,
    type: "tableau-draggable",
    data: { index, card },
  });

  const defaultFace = card.card.image_uris?.normal;
  const front = card.card.card_faces?.[0]?.image_uris?.normal;
  const back = card.card.card_faces?.[1]?.image_uris?.normal;

  const src =
    defaultFace ??
    (card.face === "back" ? back : front) ??
    front ??
    back;

  return (
    <img
      className={styles.binderCardImage}
      ref={ref}
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
  );
}

export default BinderCard;
