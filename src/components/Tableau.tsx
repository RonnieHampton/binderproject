import type { CardInstance } from "../types/scryfall";
import BinderCard from "./BinderCard";
import { useDroppable } from "@dnd-kit/react";

type TableauProps = {
  cards: CardInstance[]
}

function Tableau({ cards}: TableauProps) {
  const {ref} = useDroppable({
    id: 'tableau',
    type: 'tableau'
  })

  return (
    <>
      <div ref={ref} style={{  maxWidth: "100%",
    minHeight: "320px",
    padding: "1rem",
    border: "2px dashed gray",
    borderRadius: "12px",display: 'flex', flexDirection: 'row', gap: '1rem'}}>
        {cards.map((card, index) => (

            <div key={`${card.id}-${index}`}>
              <BinderCard card={card} index={index}/>
            </div>
          
        ))}
      </div>
    </>
  )
}

export default Tableau