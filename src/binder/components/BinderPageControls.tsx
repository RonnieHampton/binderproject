import styles from "./BinderPageControls.module.css";

type BinderPageControlsProps = {
  page: number;
  totalPages: number;
  onPageChange: (direction: number) => void;
};

function BinderPageControls({
  page,
  totalPages,
  onPageChange,
}: BinderPageControlsProps) {
  return (
    <div className={styles.pageControls}>
      <button
        className={styles.pageControlButton}
        type="button"
        onClick={() => onPageChange(-1)}
        disabled={page === 0}
      >
        Previous
      </button>

      <span className={styles.pageIndicator}>
        {`Page ${page + 1}/${totalPages}`}
      </span>

      <button
        className={styles.pageControlButton}
        type="button"
        onClick={() => onPageChange(1)}
        disabled={page >= totalPages - 1}
      >
        Next
      </button>
    </div>
  );
}

export default BinderPageControls;
