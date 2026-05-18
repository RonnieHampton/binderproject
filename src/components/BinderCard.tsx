import {useDraggable} from '@dnd-kit/react';
import type { ScryfallCard } from "../types/scryfall"

function BinderCard({card}: {card: ScryfallCard}) {
  const { ref } = useDraggable({
    id: card.id,
  });

  return (
    <img
      ref={ref}
      src={card.image_uris?.normal}
      alt={card?.name}
      style={{height: '300px', width:"auto"}}
    />
  );
}

export default BinderCard