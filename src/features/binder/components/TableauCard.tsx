import { useDraggable } from "@dnd-kit/react";
import type { CardInstance, CardLocation } from "../state/binderTypes";
import styles from "./TableauCard.module.css";
import DisplayCard from "../../cards/components/DisplayCard";
import getCardDisplayData from "../../cards/utils/getCardDisplayData";

type TableauCardProps = {
  card: CardInstance;
  index: number;
  onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
};

function TableauCard({ card, index, onCardClick }: TableauCardProps) {
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
    >
      <DisplayCard cardData={getCardDisplayData(card)} size="normal" face={card.face} />
    </div>
  );
}

export default TableauCard;
