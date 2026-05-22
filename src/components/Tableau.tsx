import type { CardInstance } from "../types/scryfall";
import BinderCard from "./BinderCard";
import { useDroppable } from "@dnd-kit/react";
import type { TableauSortMode } from "../types/tableau";
import SortTableau from '../utils/tableauUtils'
import './Tableau.css'

type TableauProps = {
  cards: CardInstance[]
  sortType: TableauSortMode;
  onSelect: (card: CardInstance, index: number) => void;
}

function Tableau({ cards, sortType, onSelect }: TableauProps) {
  const {ref} = useDroppable({
    id: 'tableau',
    type: 'tableau'
  })

  const sortedCards = SortTableau(cards, sortType);

  console.log(`Sorted Mana Values: `, sortedCards.map(column => (column.title)));

  return (
    <>
      <div ref={ref} style={{  maxWidth: "100%",
    minHeight: "320px",
    padding: "1rem",
    border: "2px dashed gray",
    borderRadius: "12px",display: 'flex', flexDirection: 'row', gap: '1rem'}}>
        {sortedCards.map((column) => (

            <section className="tableau-column" key={column.id}>
              <header className="column-header">{column.title}</header>
              <div className="card-stack">
                {column.cards.map((card) => (
                  <BinderCard onSelect={() => onSelect(card.instance, card.sourceIndex)} key={card.sourceIndex} card={card.instance} index={card.sourceIndex} />
                ))}
              </div>
            </section>
          
        ))}
      </div>
    </>
  )
}

export default Tableau