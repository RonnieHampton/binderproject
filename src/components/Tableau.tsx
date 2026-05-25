import type { CardInstance } from "../types/scryfall";
import BinderCard from "./BinderCard";
import { useDroppable } from "@dnd-kit/react";
import type { TableauSortMode } from "../types/tableau";
import SortTableau from '../utils/tableauUtils'
import './Tableau.css'

type TableauProps = {
  cards: (CardInstance | null)[]
  sortType: TableauSortMode;
  onSelect: (card: CardInstance, index: number, zone: string) => void;
  onCtrlClick: (card: CardInstance, index: number, zone: string) => void;
}

function Tableau({ cards, sortType, onSelect, onCtrlClick }: TableauProps) {
  const {ref} = useDroppable({
    id: 'tableau',
    type: 'tableau'
  })

  const sortedCards = SortTableau(cards, sortType);

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
                  <BinderCard onCtrlClick={() => onCtrlClick(card.instance, card.sourceIndex, "tableau")} 
                  onSelect={() => onSelect(card.instance, card.sourceIndex, "tableau")} key={card.sourceIndex} card={card.instance} index={card.sourceIndex} />
                ))}
              </div>
            </section>
          
        ))}
      </div>
    </>
  )
}

export default Tableau