import { useEffect, useState } from "react";
import type { CardInstance, ScryfallCard } from "../types/scryfall";
import { fetchPrintings } from "../api/scryfall";
import ManaText from "./ManaText";

type CardOptionsModalProps = {
  card: CardInstance | null;
  index: number;
  zone: string;
  handleSave: (
    changedCard: ScryfallCard,
    index: number,
    zone: string,
    face: string
  ) => void;
};

const rarityColors = {
  common: "#f0f0f0",
  uncommon: "#c0c0c0",
  rare: "#d4af37",
  mythic: "#f97316",
};

function CardOptionsModal({
  card,
  index,
  zone,
  handleSave,
}: CardOptionsModalProps) {
  const [clicked, setClicked] = useState(false);
  const [currentCard, setCurrentCard] = useState<ScryfallCard>(
    card?.card as ScryfallCard
  );
  const [altPrintings, setAltPrintings] = useState<ScryfallCard[]>([]);

  const uri = card?.card.prints_search_uri;

  const displayedFace =
    clicked
      ? card?.face === "front"
        ? "back"
        : "front"
      : card?.face ?? "front";

  const faceIndex = displayedFace === "front" ? 0 : 1;

  const imageSrc =
    currentCard.image_uris?.normal ??
    currentCard.card_faces?.[faceIndex]?.image_uris?.normal ??
    currentCard.card_faces?.[0]?.image_uris?.normal;

  const shouldShowAllFaceText =
    Boolean(currentCard.image_uris?.normal) &&
    Boolean(currentCard.card_faces?.length);

  const selectedFace = currentCard.card_faces?.[faceIndex];

  const textBlocks = shouldShowAllFaceText
    ? currentCard.card_faces?.map((face) => ({
        name: face.name,
        oracleText: face.oracle_text,
        flavorText: face.flavor_text,
      })) ?? []
    : [
        {
          name: undefined,
          oracleText: currentCard.oracle_text ?? selectedFace?.oracle_text,
          flavorText: currentCard.flavor_text ?? selectedFace?.flavor_text,
        },
      ];

  const manaCost =
    currentCard.mana_cost ?? selectedFace?.mana_cost;

  const typeLine =
    currentCard.type_line ?? selectedFace?.type_line;

  const rarityColor =
    rarityColors[currentCard.rarity as keyof typeof rarityColors] ?? "#f0f0f0";

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
        <section className="card-image" style={{ flexShrink: 0 }}>
          <img
            src={imageSrc}
            onClick={() => {
              if (currentCard.card_faces?.length === 2) {
                setClicked((prev) => !prev);
              }
            }}
            alt={currentCard.name}
            style={{
              width: "300px",
              borderRadius: "8px",
              cursor: currentCard.card_faces?.length === 2 ? "pointer" : "default",
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

          {manaCost && (
            <p>
              <strong>Mana Cost:</strong> <ManaText text={manaCost} />
            </p>
          )}

          {currentCard.cmc !== undefined && (
            <p>
              <strong>Mana Value:</strong> {currentCard.cmc}
            </p>
          )}

          {typeLine && (
            <p>
              <strong>Type:</strong> {typeLine}
            </p>
          )}

          {textBlocks.map((block, textIndex) => (
            <div key={textIndex}>
              {shouldShowAllFaceText && block.name && <h3>{block.name}</h3>}

              {block.oracleText && (
                <div>
                  <strong>Rules Text:</strong>
                  <p>
                    <ManaText text={block.oracleText} />
                  </p>
                </div>
              )}

              {block.flavorText && (
                <div>
                  <strong>Flavor Text:</strong>{" "}
                  <em>
                    <ManaText text={block.flavorText} />
                  </em>
                </div>
              )}
            </div>
          ))}

          {currentCard.color_identity && currentCard.color_identity.length > 0 && (
            <p>
              <strong>Color Identity:</strong>{" "}
              {currentCard.color_identity.map((color) => (
                <img
                  key={color}
                  src={`https://svgs.scryfall.io/card-symbols/${color}.svg`}
                  alt={color}
                  style={{
                    width: "1em",
                    height: "1em",
                    verticalAlign: "middle",
                  }}
                />
              ))}
            </p>
          )}

          {currentCard.rarity && (
            <p>
              <strong>Rarity:</strong>{" "}
              <span style={{ color: rarityColor }}>
                {currentCard.rarity.charAt(0).toUpperCase() +
                  currentCard.rarity.slice(1)}
              </span>
            </p>
          )}

          {currentCard.set_name && currentCard.collector_number && (
            <p>
              <strong>Printing:</strong> {currentCard.set_name} #
              {currentCard.collector_number}
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
              onClick={() => {
                setCurrentCard(printing);
                setClicked(false);
              }}
              src={
                printing.image_uris?.small ??
                printing.card_faces?.[0]?.image_uris?.small
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

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          type="button"
          onClick={() => {
            handleSave(currentCard, index, zone, displayedFace);
          }}
        >
          Save Selection
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentCard(card?.card as ScryfallCard);
            setClicked(false);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default CardOptionsModal;