import DisplayCard from "../../features/cards/components/DisplayCard";
import getCardDisplayData from "../../features/cards/utils/getCardDisplayData";
import type { CardInstance } from "../state/binderTypes";
import styles from "./CardOverlay.module.css";

function CardOverlay({ card }: { card: CardInstance }) {
  return (
    <div className={styles.overlay}>
      <DisplayCard cardData={getCardDisplayData(card)} size="normal" face={card.face} />
    </div>
  );
}

export default CardOverlay;
