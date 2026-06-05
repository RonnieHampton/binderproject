import type { CardInstance, CardLocation } from "../../state/binderTypes";
import TableauCard from "./TableauCard";
import { useDroppable } from "@dnd-kit/react";
import type { TableauSortMode } from "../types/tableau";
import SortTableau from '../utils/tableauUtils'
import styles from './Tableau.module.css'
import { useState } from "react";
import TableauOptionbar from "./TableauOptionbar";
import TrashDroppable from "../../components/Trash";

type TableauProps = {
  cards: CardInstance[]
  onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
  onCardContextMenu: (location: CardLocation, event: React.MouseEvent) => void;
  onClearTableau: () => void;
}

function Tableau({ cards, onCardClick, onCardContextMenu, onClearTableau }: TableauProps) {
  const [sortMode, setSortMode] = useState<TableauSortMode>("cmc");
  const [trashVisible, setTrashVisible] = useState<boolean>(false);
  const [tableauVisible, setTableauVisible] = useState<boolean>(true);
  const [multiselectEnabled, setMultiselectEnabled] = useState<boolean>(false);

  const {ref} = useDroppable({
    id: 'tableau',
    type: 'tableau'
  })

  const sortedCards = SortTableau(cards, sortMode);

  return (
    <div>
      <TableauOptionbar 
        sortMode={sortMode} 
        length={cards.length} 
        setSortMode={setSortMode} 
        setTrashVisible={setTrashVisible} 
        setTableauVisible={setTableauVisible}
        multiselectEnabled={multiselectEnabled}
        setMultiselectEnabled={setMultiselectEnabled}
        onClearTableau={onClearTableau}
      />
      {tableauVisible && (
        <section className={styles.tableau}>
          <div
            ref={ref}
            className={styles.tableauBoard}
          >
            {sortedCards.map((column) => (
            <section className={styles.tableauColumn} key={column.id}>
              <header className={styles.columnHeader}>{column.title}</header>
              <div className={styles.cardStack}>
                {column.cards.map((card) => (
                  <TableauCard onCardClick={onCardClick} onCardContextMenu={onCardContextMenu} key={card.sourceIndex} card={card.instance} index={card.sourceIndex} />
                ))}
              </div>
            </section>
          ))}
        </div>
        {trashVisible && (
          <aside className={styles.trashArea}>
            <TrashDroppable />
          </aside>
        )}
      </section>)}
    </div>
    
  )
}

export default Tableau
