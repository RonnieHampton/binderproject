import type { CardDisplayData, CardSize, CardFace } from "../types/cardTypes";
import styles from "./DisplayCard.module.css";

type DisplayCardProps = {
    cardData: CardDisplayData;
    size: CardSize;
    face: CardFace;
}

function DisplayCard({ cardData, size, face }: DisplayCardProps) {
    return (
        <div className="display-card">
            {face === "front" && <img className={`${styles.cardImage} ${styles[size]}`} src={cardData.front?.[size] || cardData.default?.[size]} alt={cardData.name} />}
            {face === "back" && <img className={`${styles.cardImage} ${styles[size]}`} src={cardData.back?.[size] || cardData.default?.[size]} alt={cardData.name} />}
        </div>
    )
}

export default DisplayCard;