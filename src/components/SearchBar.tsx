import { useEffect, useState } from "react";
import SearchResult from "./SearchResult";
import type { ScryfallCard } from "../types/scryfall"
import { fetchCards } from "../api/scryfall";
import "./SearchBar.css";

type SearchBarProps = {
  onSelectCard: (card: ScryfallCard) => void
}

function SearchBar({ onSelectCard }: SearchBarProps) {
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<ScryfallCard[]>([]);


    const handleSelectCard = (card: ScryfallCard) => {
    onSelectCard(card)
    }

    useEffect(() => {
         const timeoutId = setTimeout(async () => {
            const result = await fetchCards(searchTerm);
            setSearchResults(result);
         }, 500);

        return () => clearTimeout(timeoutId);

    }, [searchTerm]);

    const handleSearch = ({ target }: { target: HTMLInputElement }) => {
        setSearchTerm(target.value);
    };

    return(
        <>
        <div className="search-bar">
            <input type="text" value={searchTerm} onChange={(e) => handleSearch(e)} placeholder="Search..." />
            <SearchResult result={searchResults} onSelectCard={handleSelectCard}/>
        </div>
        </>
    )
}

export default SearchBar