import type { ScryfallCard } from "../../../../types/scryfall";
import ManaText from "../../../cards/components/ManaText";
import type { CardDetailsData } from "../types/cardOptionsTypes";
import { getRarityClassName, getRarityLabel } from "../utils/rarityUtils";
import styles from "./CardOptionsModal.module.css";

type CardDetailsProps = CardDetailsData & {
  card: ScryfallCard;
};

const rarityClassNames = {
  default: styles.rarityDefault,
  common: styles.rarityCommon,
  uncommon: styles.rarityUncommon,
  rare: styles.rarityRare,
  mythic: styles.rarityMythic,
};

function CardDetails({
  card,
  manaCost,
  typeLine,
  textBlocks,
  shouldShowAllFaceText,
}: CardDetailsProps) {
  const rarityClassName = getRarityClassName(card.rarity, rarityClassNames);

  return (
    <section className={styles.cardDetails}>
      <h2 className={styles.cardTitle}>{card.name}</h2>

      {manaCost && (
        <p className={styles.cardDetailRow}>
          <strong>Mana Cost:</strong> <ManaText text={manaCost} />
        </p>
      )}

      {card.cmc !== undefined && (
        <p className={styles.cardDetailRow}>
          <strong>Mana Value:</strong> {card.cmc}
        </p>
      )}

      {typeLine && (
        <p className={styles.cardDetailRow}>
          <strong>Type:</strong> {typeLine}
        </p>
      )}

      {textBlocks.map((block, textIndex) => (
        <div className={styles.textBlock} key={textIndex}>
          {shouldShowAllFaceText && block.name && (
            <h3 className={styles.faceTitle}>{block.name}</h3>
          )}

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

      {card.color_identity && card.color_identity.length > 0 && (
        <p className={styles.cardDetailRow}>
          <strong>Color Identity:</strong>{" "}
          {card.color_identity.map((color) => (
            <img
              className={styles.colorIdentityIcon}
              key={color}
              src={`https://svgs.scryfall.io/card-symbols/${color}.svg`}
              alt={color}
            />
          ))}
        </p>
      )}

      {card.rarity && (
        <p className={styles.cardDetailRow}>
          <strong>Rarity:</strong>{" "}
          <span className={rarityClassName}>{getRarityLabel(card.rarity)}</span>
        </p>
      )}

      {card.set_name && card.collector_number && (
        <p className={styles.cardDetailRow}>
          <strong>Printing:</strong> {card.set_name} #{card.collector_number}
        </p>
      )}

      {card.released_at && (
        <p className={styles.cardDetailRow}>
          <strong>Released:</strong> {card.released_at}
        </p>
      )}
    </section>
  );
}

export default CardDetails;
