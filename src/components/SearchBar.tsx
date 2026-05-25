import { useEffect, useState } from "react";
import SearchResult from "./SearchResult";
import type { ScryfallCard } from "../types/scryfall"
import { fetchCards } from "../api/scryfall";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  onSelectCard: (card: ScryfallCard) => void
}

function SearchBar({ onSelectCard }: SearchBarProps) {
    const [focused, setFocused] = useState(false);
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
        <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className={styles.searchBar}>
            <input className={styles.searchInput} type="text" value={searchTerm} onChange={handleSearch} placeholder="Search..." />
            {focused && <SearchResult result={searchResults} onSelectCard={handleSelectCard}/>}
        </div>
        </>
    )
}

export default SearchBar
