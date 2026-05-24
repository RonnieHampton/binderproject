import {useDraggable} from '@dnd-kit/react';
import type { CardInstance } from "../types/scryfall"

type BinderCardProps = {
  card: CardInstance;
  index: number;
  onSelect: (card: CardInstance, index: number) => void;
};

function BinderCard({card, index, onSelect }: BinderCardProps) {
  const { ref } = useDraggable({
    id: `${index}-${card.id}`,
    type: "tableau-draggable",
    data: {index, card}
  });

  return (
    <img
      ref={ref}
      src={card.card.image_uris?.normal ?? card.card.card_faces?.[0]?.image_uris?.normal}
      alt={card.card?.name}
      style={{height: '300px', width:"auto", borderRadius: "13px"}}
      onClick={() => onSelect(card, index)}
    />
  );
}

export default BinderCard