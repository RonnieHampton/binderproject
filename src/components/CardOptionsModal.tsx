import { useEffect, useState } from "react";
import type { CardInstance, ScryfallCard } from "../types/scryfall";
import { fetchPrintings } from "../api/scryfall";

type CardOptionsModalProps = {
    card: CardInstance | null;
    index: number;
    zone: string
    handleSave: (changedCard: ScryfallCard, index: number, zone: string) => void;
};

function CardOptionsModal({ card, index, zone, handleSave }: CardOptionsModalProps) {
    const [clicked, setClicked] = useState(false);
    const [currentCard, setCurrentCard] = useState<ScryfallCard>(card?.card as ScryfallCard);
    const [altPrintings, setAltPrintings] = useState<ScryfallCard[]>([]);
    const IMG = currentCard?.image_uris?.normal;
    const FACEONE = currentCard?.card_faces?.[0]?.image_uris?.normal;
    const FACETWO = currentCard?.card_faces?.[1]?.image_uris?.normal;
    const originalCard = card?.card;
    const uri = card?.card.prints_search_uri

    useEffect(() => {
        async function loadPrintings() {
            if (!uri) return;
            const printings = await fetchPrintings(uri);
            setAltPrintings(printings);
        }
        loadPrintings();
    }, [uri]);

  return (
    <div
    style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        maxHeight: "90vh",
        overflow: "hidden",
    }}
    >
    <div
        style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "flex-start",
        overflow: "hidden",
        }}
    >
        <section
        className="card-image"
        style={{
            flexShrink: 0,
        }}
        >
        <img
            src={(clicked && FACETWO) ? FACETWO : (IMG ?? FACEONE)}
            onClick={() => setClicked(!clicked)}
            alt={card?.card.name}
            style={{
            width: "300px",
            borderRadius: "8px",
            cursor: "pointer",
            }}
        />
        </section>

        <section
        className="card-details"
        style={{
            flex: 1,
            overflowY: "auto",
            maxHeight: "70vh",
            paddingRight: "0.5rem",
            color: "#f0f0f0",
            textAlign: "left",
            maxWidth: "700px",
            }}
        >
        <h2>{currentCard.name}</h2>

            {currentCard.mana_cost && (
                <p>
                    <strong>Mana Cost:</strong> {currentCard.mana_cost}
                </p>
            )}

            {currentCard.cmc !== undefined && (
                <p>
                    <strong>Mana Value:</strong> {currentCard.cmc}
                </p>
            )}

            {currentCard.type_line && (
                <p>
                    <strong>Type:</strong> {currentCard.type_line}
                </p>
            )}

            {currentCard.oracle_text && (
                <div>
                    <strong>Rules Text:</strong>
                    <p>{currentCard.oracle_text}</p>
                </div>
            )}

            {currentCard.flavor_text && (
                <div>
                    <strong>Flavor Text:</strong>
                    <em>{currentCard.flavor_text}</em>
                </div>
            )}

            {currentCard.colors && currentCard.colors.length > 0 && (
                <p>
                    <strong>Colors:</strong> {currentCard.colors.join(", ")}
                </p>
            )}

            {currentCard.color_identity && currentCard.color_identity.length > 0 && (
                <p>
                    <strong>Color Identity:</strong>{" "}
                    {currentCard.color_identity.join(", ")}
                </p>
            )}

            {currentCard.rarity && (
                <p>
                    <strong>Rarity:</strong> {currentCard.rarity}
                </p>
            )}

            {currentCard.set_name && currentCard.collector_number && (
                <p>
                    <strong>Printing:</strong>{" "}
                    {currentCard.set_name} #{currentCard.collector_number}
                </p>
            )}

            {currentCard.released_at && (
                <p>
                    <strong>Released:</strong> {currentCard.released_at}
                </p>
            )}
        </section>
    </div>

    <div>
        <section
        className="card-printings"
        style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
        }}
        >
        {altPrintings.map((printing) => (
            <img
            key={printing.id}
            onClick={() => setCurrentCard(printing)}
            src={
                printing.image_uris?.small ??
                printing?.card_faces?.[0]?.image_uris?.small
            }
            alt={printing.name}
            style={{
                width: "80px",
                borderRadius: "6px",
                cursor: "pointer",
                flexShrink: 0,
            }}
            />
        ))}
        </section>
    </div>

    <div
        style={{
        display: "flex",
        gap: "1rem",
        }}
    >
        <button
        type="button"
        onClick={() => {
            handleSave(currentCard, index, zone);
        }}
        >
        Save Selection
        </button>

        <button
        onClick={() =>
            setCurrentCard(originalCard as ScryfallCard)
        }
        >
        Reset
        </button>
    </div>
    </div>
  );
}

export default CardOptionsModal;