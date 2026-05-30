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
            <img
                className={`${styles.cardImage} ${styles[size]}`}
                src={cardData[face]?.[size] || cardData.default?.[size]}
                alt={cardData.name}
            />
        </div>
    )
}

export default DisplayCard;
