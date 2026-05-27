import { useEffect, useState } from "react";
import type { ScryfallCard } from "../../../types/scryfall";
import type { CardFace, CardInstance, CardZone } from "../../binder/state/binderTypes";
import { fetchPrintings } from "../../../api/scryfall";
import ManaText from "./ManaText";
import styles from "./CardOptionsModal.module.css";

type CardOptionsModalProps = {
  card: CardInstance | null;
  index: number;
  zone: CardZone;
  handleSave: (
    changedCard: ScryfallCard,
    index: number,
    zone: CardZone,
    face: CardFace
  ) => void;
};

const rarityClassNames = {
  common: styles.rarityCommon,
  uncommon: styles.rarityUncommon,
  rare: styles.rarityRare,
  mythic: styles.rarityMythic,
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

  const displayedFace: CardFace =
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

  const rarityClassName =
    rarityClassNames[currentCard.rarity as keyof typeof rarityClassNames] ??
    styles.rarityDefault;

  const canFlipCard = currentCard.card_faces?.length === 2;

  useEffect(() => {
    async function loadPrintings() {
      if (!uri) return;
      const printings = await fetchPrintings(uri);
      setAltPrintings(printings);
    }

    loadPrintings();
  }, [uri]);

  return (
    <div className={styles.cardOptionsModal}>
      <div className={styles.cardSummary}>
        <section className={styles.cardImage}>
          <img
            className={`${styles.previewImage} ${
              canFlipCard ? styles.previewImageFlippable : styles.previewImageStatic
            }`}
            src={imageSrc}
            onClick={() => {
              if (canFlipCard) {
                setClicked((prev) => !prev);
              }
            }}
            alt={currentCard.name}
          />
        </section>

        <section className={styles.cardDetails}>
          <h2 className={styles.cardTitle}>{currentCard.name}</h2>

          {manaCost && (
            <p className={styles.cardDetailRow}>
              <strong>Mana Cost:</strong> <ManaText text={manaCost} />
            </p>
          )}

          {currentCard.cmc !== undefined && (
            <p className={styles.cardDetailRow}>
              <strong>Mana Value:</strong> {currentCard.cmc}
            </p>
          )}

          {typeLine && (
            <p className={styles.cardDetailRow}>
              <strong>Type:</strong> {typeLine}
            </p>
          )}

          {textBlocks.map((block, textIndex) => (
            <div className={styles.textBlock} key={textIndex}>
              {shouldShowAllFaceText && block.name && <h3 className={styles.faceTitle}>{block.name}</h3>}

              {block.oracleText && (
                <div className={styles.rulesText}>
                  <strong>Rules Text:</strong>
                  <p className={styles.cardDetailRow}>
                    <ManaText text={block.oracleText} />
                  </p>
                </div>
              )}

              {block.flavorText && (
                <div className={styles.flavorText}>
                  <strong>Flavor Text:</strong>{" "}
                  <em>
                    <ManaText text={block.flavorText} />
                  </em>
                </div>
              )}
            </div>
          ))}

          {currentCard.color_identity && currentCard.color_identity.length > 0 && (
            <p className={styles.cardDetailRow}>
              <strong>Color Identity:</strong>{" "}
              {currentCard.color_identity.map((color) => (
                <img
                  className={styles.colorIdentityIcon}
                  key={color}
                  src={`https://svgs.scryfall.io/card-symbols/${color}.svg`}
                  alt={color}
                />
              ))}
            </p>
          )}

          {currentCard.rarity && (
            <p className={styles.cardDetailRow}>
              <strong>Rarity:</strong>{" "}
              <span className={rarityClassName}>
                {currentCard.rarity.charAt(0).toUpperCase() +
                  currentCard.rarity.slice(1)}
              </span>
            </p>
          )}

          {currentCard.set_name && currentCard.collector_number && (
            <p className={styles.cardDetailRow}>
              <strong>Printing:</strong> {currentCard.set_name} #
              {currentCard.collector_number}
            </p>
          )}

          {currentCard.released_at && (
            <p className={styles.cardDetailRow}>
              <strong>Released:</strong> {currentCard.released_at}
            </p>
          )}
        </section>
      </div>

      <div className={styles.printingsArea}>
        <section className={styles.cardPrintings}>
          {altPrintings.map((printing) => (
            <img
              className={styles.printingImage}
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
            />
          ))}
        </section>
      </div>

      <div className={styles.modalActions}>
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
