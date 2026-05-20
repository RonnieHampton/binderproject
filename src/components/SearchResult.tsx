import type { ScryfallCard } from "../types/scryfall";
import "./SearchResult.css";

type SearchResultProps = {
  result: ScryfallCard[]
  onSelectCard?: (card: ScryfallCard) => void
}

function SearchResult({ result, onSelectCard }: SearchResultProps) {
  return (
    <div className="result-list">
    {result.slice(0, 5).map((card) => (
        <button
          className="result-row"
          key={card.id}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelectCard?.(card);
          }}
        >
          <img
            className="result-thumb"
            src={card.image_uris?.small}
            alt={card.name}
          />

          <div className="result-text">
            <strong>{card.name}</strong>
            <span>
              {card.set?.toUpperCase()} · {card.collector_number}
            </span>
          </div>
        </button>
    ))}
    </div>
  )
}

export default SearchResult