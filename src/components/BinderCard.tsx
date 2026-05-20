import {useDraggable} from '@dnd-kit/react';
import type { CardInstance } from "../types/scryfall"

function BinderCard({card, index}: {card: CardInstance, index: number}) {
  const { ref } = useDraggable({
    id: card.id,
    type: "tableau-draggable",
    data: {index, card}
  });

  return (
    <img
      ref={ref}
      src={card.card.image_uris?.normal}
      alt={card.card?.name}
      style={{height: '300px', width:"auto"}}
    />
  );
}

export default BinderCard