import type { CardInstance } from "../../../../binder/state/binderTypes";
import DisplayCard from "../../../cards/components/DisplayCard";
import getCardDisplayData from "../../../cards/utils/getCardDisplayData";
import styles from "./CardOptionsModal.module.css";
import CardFlipAnimation from "../../../cards/components/CardFlipAnimation";
import { hasDistinctCardFaces } from "../../../cards/utils/cardFaceUtils";

type ModalCardProps = {
  instance: CardInstance;
  onCardClick: (instance: CardInstance) => void;
};

function ModalFlipIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.modalFlipIcon}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M20 11a8 8 0 0 0-14.9-4" />
      <path d="M5 3v4h4" />
      <path d="M4 13a8 8 0 0 0 14.9 4" />
      <path d="M19 21v-4h-4" />
    </svg>
  );
}

function ModalCard({ instance, onCardClick }: ModalCardProps) {
  const canFlip = hasDistinctCardFaces(instance.card);

  return (

    <div className={styles.modalCard} onClick={() => onCardClick(instance)}>
      <CardFlipAnimation face={instance.face}>
        {(displayFace) => (
          <DisplayCard cardData={getCardDisplayData(instance)} size="large" face={displayFace} />
        )}
      </CardFlipAnimation>
      {canFlip && (
        <div className={styles.modalFlipHint} aria-hidden="true">
          <ModalFlipIcon />
        </div>
      )}
    </div>
  );
}

export default ModalCard;
