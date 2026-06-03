import type { CardInstance } from "../../../binder/state/binderTypes";
import DisplayCard from "../../../cards/components/DisplayCard";
import getCardDisplayData from "../../../cards/utils/getCardDisplayData";
import styles from "./CardOptionsModal.module.css";
import CardFlipAnimation from "../../../cards/components/CardFlipAnimation";

type ModalCardProps = {
  instance: CardInstance;
  onCardClick: (instance: CardInstance) => void;
}
function ModalCard({instance, onCardClick}: ModalCardProps) {
    return (

        <div className={styles.modalCard} onClick={() => onCardClick(instance)}>
            <CardFlipAnimation face={instance.face}>
                {(displayFace) => (
                    <DisplayCard cardData={getCardDisplayData(instance)} size="large" face={displayFace} />
                )}
            </CardFlipAnimation>
        </div>
    )
}

export default ModalCard;
