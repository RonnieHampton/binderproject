import type { SearchStatus } from "../hooks/useCardPrintings";
import type { CardInstance } from "../../binder/state/binderTypes";
import type { ScryfallCard } from "../../../types/scryfall";
import styles from "./RightClickMenu.module.css";

type RightClickPrintingSubmenuProps = {
  instance: CardInstance;
  printings: ScryfallCard[];
  status: SearchStatus;
  errorMessage: string;
  onPrintingClick?: (printing: CardInstance) => void;
};

function RightClickPrintingSubmenu({
  instance,
  printings,
  status,
  errorMessage,
  onPrintingClick,
}: RightClickPrintingSubmenuProps) {
  return (
     <div className={styles.printingSubmenu}>
      {status === "loading" && (
        <p className={styles.printingStatus}>Loading printings...</p>
      )}

      {status === "error" && (
        <p className={styles.printingStatus}>{errorMessage}</p>
      )}

      
        <section className={styles.cardPrintings}>
          {printings.map((printing) => (
            <button
              className={styles.printingOption}
              key={printing.id}
              onClick={() => onPrintingClick?.({
                ...instance,
                card: printing,
              })}
            type="button"
          >
            <img
              className={styles.printingImage}
              src={
                printing.image_uris?.small ??
                printing.card_faces?.[0]?.image_uris?.small
              }
              alt={printing.name}
            />
            <span className={styles.setName}>{printing.set_name}</span>
            <p className={styles.collectorNumber}>{printing.collector_number}</p>
          </button>
        ))}
      </section>
    </div>
  );
}

export default RightClickPrintingSubmenu;
