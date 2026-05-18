import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import type { ScryfallCard } from "../types/scryfall"
import Tableau from "../components/Tableau";
import { useState } from "react";


function BinderCreate() {
	const [tableauCards, setTableauCards] = useState<ScryfallCard[]>([])

    const handleSelectCard = (card: ScryfallCard) => {
        setTableauCards((prev) => [...prev, card])
    }

    const handleRemoveCard = (index: number) => {
        setTableauCards((prev) => prev.filter((_, i) => i !== index))
    }

	return (
        <>
		<div>
            <div className="topArea">
			<Link to="/">Home</Link>
            <br/>
			<SearchBar onSelectCard={handleSelectCard} />
            <br />
            </div>
            <Tableau onRemoveCard={handleRemoveCard} cards={tableauCards}/>
		</div>
            

    </>
	)
}

export default BinderCreate