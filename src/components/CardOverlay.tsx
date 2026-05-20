import type { CardInstance } from "../types/scryfall";

function CardOverlay({ card }: { card: CardInstance }) {
    return (
        <img
        src={card.card.image_uris?.normal}
        alt={card.card?.name}
        style={{height: '300px', width:"auto"}}
        />
    )
}

export default CardOverlay;