import type { CardInstance, CardZone } from "../../binder/state/binderTypes";
import BinderCard from "../../binder/components/BinderCard";
import { useDroppable } from "@dnd-kit/react";
import type { TableauSortMode } from "../types/tableau";
import SortTableau from '../utils/tableauUtils'
import styles from './Tableau.module.css'

type TableauProps = {
  cards: (CardInstance | null)[]
  sortType: TableauSortMode;
  onSelect: (card: CardInstance, index: number, zone: CardZone) => void;
  onCtrlClick: (card: CardInstance, index: number, zone: CardZone) => void;
}

function Tableau({ cards, sortType, onSelect, onCtrlClick }: TableauProps) {
  const {ref} = useDroppable({
    id: 'tableau',
    type: 'tableau'
  })

  const sortedCards = SortTableau(cards, sortType);

  return (
    <>
      <div ref={ref} className={styles.tableauBoard}>
        {sortedCards.map((column) => (

            <section className={styles.tableauColumn} key={column.id}>
              <header className={styles.columnHeader}>{column.title}</header>
              <div className={styles.cardStack}>
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
