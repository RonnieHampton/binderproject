import type { CardInstance, CardLocation } from "../../binder/state/binderTypes";
import TableauCard from "../../binder/components/TableauCard";
import { useDroppable } from "@dnd-kit/react";
import type { TableauSortMode } from "../types/tableau";
import SortTableau from '../utils/tableauUtils'
import styles from './Tableau.module.css'

type TableauProps = {
  cards: (CardInstance | null)[]
  sortType: TableauSortMode;
  onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
}

function Tableau({ cards, sortType, onCardClick }: TableauProps) {
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
                  <TableauCard onCardClick={onCardClick} key={card.sourceIndex} card={card.instance} index={card.sourceIndex} />
                ))}
              </div>
            </section>
          
        ))}
      </div>
    </>
  )
}

export default Tableau
