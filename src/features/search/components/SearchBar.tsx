import { useEffect, useState } from "react";
import SearchResult from "./SearchResult";
import type { ScryfallCard } from "../../../types/scryfall"
import { fetchCards } from "../../../api/scryfall";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  onSelectCard: (card: ScryfallCard) => void
}

type SearchStatus = "idle" | "loading" | "success" | "error";

function SearchBar({ onSelectCard }: SearchBarProps) {
    const [focused, setFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<ScryfallCard[]>([]);
    const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
    const [errorMessage, setErrorMessage] = useState("");


    const handleSelectCard = (card: ScryfallCard) => {
    onSelectCard(card)
    }

    useEffect(() => {
         const trimmedSearchTerm = searchTerm.trim();

         if (!trimmedSearchTerm) {
            return;
         }

         let isCurrentSearch = true;

         const timeoutId = setTimeout(async () => {
            const result = await fetchCards(trimmedSearchTerm);

            if (!isCurrentSearch) return;

            if (result.status === "error") {
              setSearchResults([]);
              setErrorMessage(result.message);
              setSearchStatus("error");
              return;
            }

            if (result.status === "success") {
              setSearchResults(result.data);
              setSearchStatus("success");
            }
         }, 500);

        return () => {
            isCurrentSearch = false;
            clearTimeout(timeoutId);
        };

    }, [searchTerm]);

    const handleSearch = ({ target }: { target: HTMLInputElement }) => {
        const nextSearchTerm = target.value;

        setSearchTerm(nextSearchTerm);

        if (!nextSearchTerm.trim()) {
            setSearchResults([]);
            setSearchStatus("idle");
            setErrorMessage("");
            return;
        }

        setSearchStatus("loading");
        setErrorMessage("");
    };

    const showSearchPanel = focused && searchTerm.trim().length > 0;
    const hasResults = searchResults.length > 0;

    return(
        <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className={styles.searchBar}>
            <input 
                className={styles.searchInput} 
                type="text" value={searchTerm} 
                onChange={handleSearch} 
                placeholder="Search..." 
            />
            {showSearchPanel && searchStatus === "loading" && (
                <div className={styles.searchStatusPanel}>Searching Scryfall...</div>
            )}
            {showSearchPanel && searchStatus === "error" && (
                <div className={styles.searchStatusPanel}>{errorMessage}</div>
            )}
            {showSearchPanel && searchStatus === "success" && hasResults && (
                <SearchResult result={searchResults} onSelectCard={handleSelectCard}/>
            )}
            {showSearchPanel && searchStatus === "success" && !hasResults && (
                <div className={styles.searchStatusPanel}>No cards found.</div>
            )}
        </div>
    )
}

export default SearchBar
