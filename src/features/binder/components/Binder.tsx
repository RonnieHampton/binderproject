import BinderSlot from "./BinderSlot";
import type { CardInstance } from "../state/binderTypes";
import styles from "./Binder.module.css";

type BinderProps = {
  cards: (CardInstance | null)[];
  page: number;
  onPageChange: (direction: number) => void;
  onCardClick: (index: number, event: React.MouseEvent) => void;
};

const CARDS_PER_PAGE = 12;

function Binder({ cards, page, onPageChange, onCardClick }: BinderProps) {
  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);

  return (
    <div className={styles.binder}>
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
                key={start + index}
                instance={instance}
                index={start + index}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        );
      })}

      <div className={styles.pageControls}>
        <button onClick={() => onPageChange(-1)} disabled={page === 0}>
          Previous Page
        </button>

        <button onClick={() => onPageChange(1)} disabled={page >= totalPages - 1}>
          Next Page
        </button>
      </div>
    </div>
  );
}

export default Binder;
