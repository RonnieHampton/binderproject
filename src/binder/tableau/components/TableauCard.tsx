import { useDraggable } from "@dnd-kit/react";
import type { CardInstance, CardLocation } from "../../state/binderTypes";
import styles from "./TableauCard.module.css";
import DisplayCard from "../../../features/cards/components/DisplayCard";
import getCardDisplayData from "../../../features/cards/utils/getCardDisplayData";
import getCardTooltip from "../../../features/cards/utils/getCardTooltip";
import CardFlipAnimation from "../../../features/cards/components/CardFlipAnimation";
import type { BinderSettings } from "../../types/binderSettings";

type TableauCardProps = {
  card: CardInstance;
  index: number;
  selectedCard?: CardLocation | null;
  settings: BinderSettings;
  onMouseEnter: (location: CardLocation) => void;
  onMouseLeave: () => void;
  onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
  onCardContextMenu: (location: CardLocation, event: React.MouseEvent) => void;
  dragAndDropEnabled: boolean;
};

function TableauCard({ card, index, onCardClick, onCardContextMenu, settings, selectedCard, onMouseEnter, onMouseLeave, dragAndDropEnabled }: TableauCardProps) {
  const { ref } = useDraggable({
    id: `${index}-${card.id}`,
    type: "tableau-draggable",
    data: { index, card },
    disabled: !dragAndDropEnabled
  });

    const shouldShowSelection =
        settings.keyboardOnlyMode ||
        settings.clickCompatibilityMode;

    const isSelected =
        shouldShowSelection &&
        selectedCard?.zone === "tableau" &&
        selectedCard.index === index;

  return (
    <div
      ref={ref}
      className={`${styles.tableauCard} ${isSelected ? styles.selectedCard : ""}`}
      onClick={(e) => {onCardClick({ zone: "tableau", index }, e)}}
      onContextMenu={(e) => {onCardContextMenu({ zone: "tableau", index }, e)}}
      title={settings.showCardTooltips ? getCardTooltip(card) : undefined}
      onMouseEnter={() => onMouseEnter({ zone: "tableau", index })}
      onMouseLeave={onMouseLeave}
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
