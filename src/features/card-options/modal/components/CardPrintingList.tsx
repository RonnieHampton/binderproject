import useCardPrintings from "../../hooks/useCardPrintings";
import type { CardPrintingListProps } from "../types/cardOptionsTypes";
import styles from "./CardOptionsModal.module.css";

function CardPrintingList({ instance, handlePrintingClick }: CardPrintingListProps) {
  const { printings, status, errorMessage } = useCardPrintings(
    instance.card.prints_search_uri
  );

  return (
    <div className={styles.printingsArea}>
      {status === "loading" && (
        <p className={styles.printingStatus}>Loading printings...</p>
      )}

      {status === "error" && (
        <p className={styles.printingStatus}>{errorMessage}</p>
      )}

      <section className={styles.cardPrintings}>
        {printings.map((printing) => (
          <div key={printing.id} className={styles.printingContainer}>
          <img
            className={styles.printingImage}
            onClick={() => handlePrintingClick(printing)}
            src={
              printing.image_uris?.small ??
              printing.card_faces?.[0]?.image_uris?.small
            }
            alt={printing.name}
          />
          <p>{printing.collector_number}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default CardPrintingList;
