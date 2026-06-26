import type { CardInstance, CardLocation } from "../state/binderTypes";
import { useDroppable } from "@dnd-kit/react";
import BinderCard from "./BinderCard";
import styles from "./BinderSlot.module.css";
import { useEffect } from "react";
import type { BinderSettings } from "../types/binderSettings";

type BinderSlotProps = {
  active: boolean;
  instance: CardInstance | null;
  index: number;
  onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
  onCardContextMenu: (location: CardLocation, event: React.MouseEvent) => void;
  onFlipCard: (location: CardLocation) => void;
  onTrashCard: (location: CardLocation) => void;
  onMouseEnter: (location: CardLocation) => void;
  onMouseLeave: () => void;
  selectedCard: CardLocation | null;
  targetCard: CardLocation | null;
  settings: BinderSettings;
  dragAndDropEnabled: boolean;
  onSlotClick: (location: CardLocation, event: React.MouseEvent) => void;
};

function BinderSlot({
  active,
  instance,
  index,
  onCardClick,
  onCardContextMenu,
  onFlipCard,
  onTrashCard,
  onMouseEnter,
  onMouseLeave,
  selectedCard,
  targetCard,
  settings,
  dragAndDropEnabled,
  onSlotClick }: BinderSlotProps) {

  const { droppable, ref: ref } = useDroppable({
    id: `slot-${index}`,
    data: { index },
    disabled: !active || !dragAndDropEnabled,
    type: "binder-droppable",
  });

  useEffect(() => {
    // Page changes during a drag require newly visible slots to be remeasured.
    if (active) {
      droppable.refreshShape();
    }
  }, [active, droppable]);

  const shouldShowSelection =
    settings.keyboardOnlyMode ||
    settings.clickCompatibilityMode;

  const isSelected =
    shouldShowSelection &&
    selectedCard?.zone === "binder" &&
    selectedCard.index === index;

  const isTarget =
    shouldShowSelection &&
    targetCard?.zone === "binder" &&
    targetCard.index === index;

  return (
    <div
      ref={ref}
      className={`${styles.binderSlot} ${isSelected ? styles.selectedSlot : ""} ${isTarget ? styles.targetSlot : ""}`}
      onClick={(e) => onSlotClick({ index: index, zone: "binder" }, e)}>
      {instance && <BinderCard
        instance={instance}
        index={index}
        onCardClick={onCardClick}
        onCardContextMenu={onCardContextMenu}
        onFlipCard={onFlipCard}
        onTrashCard={onTrashCard}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        settings={settings}
        dragAndDropEnabled={dragAndDropEnabled}
      />}
      {!instance && <p className={styles.slotIndex}>+</p>}
      {!instance && settings.showEmptySlotNumbers && <p className={styles.slotNumber}>{index + 1}</p>}
    </div>
  );
}

export default BinderSlot;
