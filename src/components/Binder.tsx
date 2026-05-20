import BinderDroppable from "./BinderDroppable";
import type { CardInstance } from "../types/scryfall";
import { useState } from "react";

type BinderProps = {
  cards: (CardInstance | null)[]
}


function Binder({ cards }: BinderProps) {
  const [page, setPage] = useState(0);
  const start = page * 12;
  const end = start + 12;

  return (
    <>
    <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  }}>
    {cards.slice(start, end).map((card, index) => (
      <BinderDroppable key={index} card={card} index={index + (page * 12)} />
    ))}

    </div>
    <button onClick={() => setPage(page - 1)} disabled={page === 0}> Previous Page </button>
    <button onClick={() => setPage(page + 1)} disabled={page === 4}> Next Page </button>
    </>
  );
}

export default Binder