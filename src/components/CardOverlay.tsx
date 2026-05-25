import type { CardInstance } from "../types/scryfall";
import styles from "./CardOverlay.module.css";

function CardOverlay({ card }: { card: CardInstance }) {
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
      className={styles.cardOverlayImage}
      src={src}
      alt={card.card.name}
    />
  );
}

export default CardOverlay;
