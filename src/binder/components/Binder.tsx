import BinderSlot from "./BinderSlot";
import type { ReactNode } from "react";
import type { CardInstance, CardLocation } from "../state/binderTypes";
import styles from "./Binder.module.css";
import { CARDS_PER_PAGE } from "../config/binderConfig";
import BinderPageControls from "./BinderPageControls";
import type { BinderSettings } from "../types/binderSettings";

type BinderProps = {
  cards: (CardInstance | null)[];
  page: number;
  footerStart?: ReactNode;
  onPageChange: (direction: number) => void;
  onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
  onCardContextMenu: (location: CardLocation, event: React.MouseEvent) => void;
  onFlipCard: (location: CardLocation) => void;
  onTrashCard: (location: CardLocation) => void;
  onMouseEnter: (location: CardLocation) => void;
  onMouseLeave: () => void;
  selectedCard: CardLocation | null;
  settings: BinderSettings;
  dragAndDropEnabled: boolean;
  onSlotClick: (location: CardLocation) => void;
};

function Binder({
  cards,
  page,
  footerStart,
  onPageChange,
  onCardClick,
  onCardContextMenu,
  onFlipCard,
  onTrashCard,
  onMouseEnter,
  onMouseLeave,
  selectedCard,
  settings,
  dragAndDropEnabled,
  onSlotClick
}: BinderProps) {
  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);

  return (
    <div className={styles.binder}>
      <div className={styles.topControls}>
        <BinderPageControls
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const start = pageIndex * CARDS_PER_PAGE;
        const end = start + CARDS_PER_PAGE;
        const pageCards = cards.slice(start, end);

        const isVisible = pageIndex === page;

        return (
          <div
            key={pageIndex}
            className={`${styles.binderPage} ${
              isVisible ? styles.binderPageVisible : styles.binderPageHidden
            }`}
          >
            {pageCards.map((instance, index) => (
              <BinderSlot
                active={isVisible}
                key={start + index}
                instance={instance}
                index={start + index}
                onCardClick={onCardClick}
                onCardContextMenu={onCardContextMenu}
                onFlipCard={onFlipCard}
                onTrashCard={onTrashCard}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                selectedCard={selectedCard}
                settings={settings}
                dragAndDropEnabled={dragAndDropEnabled}
                onSlotClick={onSlotClick}
              />
            ))}
          </div>
        );
      })}

      <div className={styles.binderFooter}>
        <div className={styles.footerStart}>{footerStart}</div>

        <BinderPageControls
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />

        <div aria-hidden="true" />
      </div>
    </div>
  );
}

export default Binder;
