import { useState } from "react";
import CardDetails from "./CardDetails";
import styles from "./CardOptionsModal.module.css";
import ModalCard from "./ModalCard";
import CardPrintingList from "./CardPrintingList";
import CardModalActions from "./CardModalActions";
import type { CardInstance } from "../../../binder/state/binderTypes";
import type { CardOptionsModalProps } from "../types/cardOptionsTypes";
import { getCardDetailsData } from "../utils/cardTextUtils";

function CardOptionsModal({
  card,
  handleSave,
}: CardOptionsModalProps) {
  const [modalCardInstance, setModalCardInstance] = useState<CardInstance>(card);

  const currentCard = modalCardInstance.card;
  const cardDetailsData = getCardDetailsData(modalCardInstance);

  const handleModalCardClick = (instance: CardInstance) => {
    if (instance.card.card_faces?.length !== 2) {
      setModalCardInstance({
        ...instance,
        face: "front",
      });
    } else {
      setModalCardInstance({
        ...instance,
        face: instance.face === "front" ? "back" : "front",
      });
    }
  };

  return (
    <div className={styles.cardOptionsModal}>
      <div className={styles.cardSummary}>
        <section className={styles.cardImage}>
          <ModalCard
            instance={modalCardInstance}
            onCardClick={handleModalCardClick}
          />
        </section>

        <CardDetails
          card={currentCard}
          {...cardDetailsData}
        />
      </div>

      <CardPrintingList
        instance={modalCardInstance}
        handlePrintingClick={(printing) => {
          setModalCardInstance((prev) => ({
            ...prev,
            card: printing,
            face: printing.card_faces?.length === 2 ? prev.face : "front",
          }));
        }}
      />

      <CardModalActions
        onReset={() => setModalCardInstance(card)}
        onSave={() => handleSave(modalCardInstance)}
      />
    </div>
  );
}

export default CardOptionsModal;
