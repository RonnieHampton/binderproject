import type { CardModalActionsProps } from "../types/cardOptionsTypes";
import styles from "./CardOptionsModal.module.css";

function CardModalActions({ onReset, onSave }: CardModalActionsProps) {
  return (
    <div className={styles.modalActions}>
      <button type="button" onClick={onSave}>
        Save Selection
      </button>

      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default CardModalActions;
