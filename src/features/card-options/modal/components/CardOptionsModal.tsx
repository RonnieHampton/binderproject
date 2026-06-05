import { useState, type CSSProperties } from "react";
import CardDetails from "./CardDetails";
import styles from "./CardOptionsModal.module.css";
import ModalCard from "./ModalCard";
import CardPrintingList from "./CardPrintingList";
import CardModalActions from "./CardModalActions";
import type { CardInstance } from "../../../../binder/state/binderTypes";
import type { CardOptionsModalProps } from "../types/cardOptionsTypes";
import { getCardDetailsData } from "../utils/cardTextUtils";
import { hasDistinctCardFaces } from "../../../cards/utils/cardFaceUtils";

const colorIdentityGlow = {
  W: "rgba(250, 245, 214, 0.32)",
  U: "rgba(83, 161, 255, 0.28)",
  B: "rgba(92, 73, 108, 0.34)",
  R: "rgba(239, 92, 54, 0.3)",
  G: "rgba(76, 164, 96, 0.3)",
  C: "rgba(203, 213, 225, 0.22)",
};

function getModalColorStyle(colorIdentity?: string[]): CSSProperties {
  const colors = colorIdentity && colorIdentity.length > 0 ? colorIdentity : ["C"];

  return {
    "--modal-glow-1":
      colorIdentityGlow[colors[0] as keyof typeof colorIdentityGlow] ?? colorIdentityGlow.C,
    "--modal-glow-2":
      colorIdentityGlow[colors[1] as keyof typeof colorIdentityGlow] ??
      colorIdentityGlow[colors[0] as keyof typeof colorIdentityGlow] ??
      colorIdentityGlow.C,
    "--modal-glow-3":
      colorIdentityGlow[colors[2] as keyof typeof colorIdentityGlow] ?? "transparent",
    "--modal-glow-4":
      colorIdentityGlow[colors[3] as keyof typeof colorIdentityGlow] ?? "transparent",
    "--modal-glow-5":
      colorIdentityGlow[colors[4] as keyof typeof colorIdentityGlow] ?? "transparent",
  } as CSSProperties;
}

function CardOptionsModal({
  card,
  handleSave,
  onClose,
}: CardOptionsModalProps) {
  const [modalCardInstance, setModalCardInstance] = useState<CardInstance>(card);

  const currentCard = modalCardInstance.card;
  const cardDetailsData = getCardDetailsData(modalCardInstance);
  const modalColorStyle = getModalColorStyle(currentCard.color_identity);

  const handleModalCardClick = (instance: CardInstance) => {
    if (!hasDistinctCardFaces(instance.card)) {
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
    <div className={styles.cardOptionsModal} style={modalColorStyle}>
      <button
        className={styles.closeButton}
        type="button"
        aria-label="Close card options"
        onClick={onClose}
      />

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
            face: hasDistinctCardFaces(printing) ? prev.face : "front",
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
