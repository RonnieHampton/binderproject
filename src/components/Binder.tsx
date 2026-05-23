import BinderDroppable from "./BinderDroppable";
import type { CardInstance } from "../types/scryfall";

type BinderProps = {
  cards: (CardInstance | null)[];
  page: number;
  onPageChange: (direction: number) => void;
  onSelect: (card: CardInstance | null, index: number, zone: string) => void;
};

const CARDS_PER_PAGE = 12;

function Binder({ cards, page, onPageChange, onSelect }: BinderProps) {
  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);

  return (
    <div style={{ position: "relative" }}>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const start = pageIndex * CARDS_PER_PAGE;
        const end = start + CARDS_PER_PAGE;
        const pageCards = cards.slice(start, end);

        const isVisible = pageIndex === page;

        return (
          <div
            key={pageIndex}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",

              position: isVisible ? "relative" : "absolute",
              visibility: isVisible ? "visible" : "hidden",
              pointerEvents: isVisible ? "auto" : "none",
              opacity: isVisible ? 1 : 0,
              left: isVisible ? "auto" : "-9999px",
              top: 0,
            }}
          >
            {pageCards.map((card, index) => (
              <BinderDroppable
                onSelect={() => onSelect(card, index, "binder")}
                key={start + index}
                card={card}
                index={start + index}
              />
            ))}
          </div>
        );
      })}

      <div style={{ marginTop: "12px" }}>
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