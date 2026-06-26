
import styles from "./CardHoverOptions.module.css";

type CardHoverOptionsProps = {
  canFlip: boolean;
  onFlip: () => void;
  onTrash: () => void;
};

function FlipIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.buttonIcon}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M20 11a8 8 0 0 0-14.9-4" />
      <path d="M5 3v4h4" />
      <path d="M4 13a8 8 0 0 0 14.9 4" />
      <path d="M19 21v-4h-4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.buttonIcon}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function CardHoverOptions({ canFlip, onFlip, onTrash }: CardHoverOptionsProps) {
  return (
    <div className={styles.cardHoverOptions}>
      <button
        aria-label="Trash card"
        className={styles.trashButton}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onTrash();
        }}
      >
        <TrashIcon />
      </button>
      {canFlip && (
        <button
          aria-label="Flip card"
          className={styles.flipButton}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFlip();
          }}
        >
          <FlipIcon />
        </button>
      )}

      <div className={styles.modalHint} aria-hidden="true">
        <svg className={styles.modalHintIcon} fill="none" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 8h18" />
          <path d="M7 12h10" />
          <path d="M7 16h6" />
        </svg>
      </div>
    </div>
  );
}

export default CardHoverOptions;
