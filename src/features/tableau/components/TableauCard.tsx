import { useDraggable } from "@dnd-kit/react";
import type { CardInstance, CardLocation } from "../../binder/state/binderTypes";
import styles from "./TableauCard.module.css";
import DisplayCard from "../../cards/components/DisplayCard";
import getCardDisplayData from "../../cards/utils/getCardDisplayData";
import CardFlipAnimation from "../../cards/components/CardFlipAnimation";

type TableauCardProps = {
  card: CardInstance;
  index: number;
  onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
  onCardContextMenu: (location: CardLocation, event: React.MouseEvent) => void;
};

function TableauCard({ card, index, onCardClick, onCardContextMenu }: TableauCardProps) {
  const { ref } = useDraggable({
    id: `${index}-${card.id}`,
    type: "tableau-draggable",
    data: { index, card },
  });


  return (
    <div
      ref={ref}
      className={styles.tableauCard}
      onClick={(e) => {onCardClick({ zone: "tableau", index }, e)}}
      onContextMenu={(e) => {onCardContextMenu({ zone: "tableau", index }, e)}}
    >
      <CardFlipAnimation face={card.face}>
        {(displayFace) => (
          <DisplayCard cardData={getCardDisplayData(card)} size="normal" face={displayFace} />
        )}
      </CardFlipAnimation>
    </div>
  );
}

export default TableauCard;
