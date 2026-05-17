import type { ScryfallCard } from "../types/scryfall";

type TableauProps = {
  cards: ScryfallCard[]
  onRemoveCard?: (index: number) => void
}

function Tableau({ cards, onRemoveCard }: TableauProps) {
  return (
    <>
      <p>Tableau Component</p>

      {cards.map((card, index) => (
        <div key={`${card.id}-${index}`} onClick={() => onRemoveCard?.(index)}>
          {card.name}
        </div>
      ))}
    </>
  )
}

export default Tableau