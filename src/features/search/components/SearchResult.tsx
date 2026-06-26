import type { ScryfallCard } from "../../../types/scryfall";
import styles from "./SearchResult.module.css";

type SearchResultProps = {
  result: ScryfallCard[];
  onSelectCard?: (card: ScryfallCard) => void;
};

function SearchResult({ result, onSelectCard }: SearchResultProps) {
  return (
    <div className={styles.resultList}>
      {result.slice(0, 20).map((card) => (
        <button
          className={styles.resultRow}
          key={card.id}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelectCard?.(card);
          }}
        >
          <img
            className={styles.resultThumb}
            src={card.image_uris?.small ?? card.card_faces?.[0]?.image_uris?.small}
            alt={card.name}
          />

          <div className={styles.resultText}>
            <strong>{card.name}</strong>
            <span className={styles.resultMeta}>
              {card.set?.toUpperCase()} · {card.collector_number}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default SearchResult;
