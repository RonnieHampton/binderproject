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
		<div>
			<p>
				<br />
				<Link to="/">Home</Link>
			</p>
			<SearchBar onSelectCard={handleSelectCard} />
            <Tableau onRemoveCard={handleRemoveCard} cards={tableauCards}/>
		</div>
	)
}

export default BinderCreate