import type { ScryfallCard } from "../types/scryfall";
import BinderCard from "./BinderCard";

type TableauProps = {
  cards: ScryfallCard[]
  onRemoveCard?: (index: number) => void
}

function Tableau({ cards, onRemoveCard }: TableauProps) {
  return (
    <>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      {cards.map((card, index) => (

          <div key={`${card.id}-${index}`} onClick={() => onRemoveCard?.(index)}>
            <BinderCard card={card} />
          </div>
        
      ))}
      </div>
    </>
  )
}

export default Tableau