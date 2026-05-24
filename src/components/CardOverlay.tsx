import type { CardInstance } from "../types/scryfall";

function CardOverlay({ card }: { card: CardInstance }) {
    return (
        <img
        src={card.card.image_uris?.normal ?? card.card.card_faces?.[0]?.image_uris?.normal}
        alt={card.card?.name}
        style={{height: '300px', width:"auto"}}
        />
    )
}

export default CardOverlay;