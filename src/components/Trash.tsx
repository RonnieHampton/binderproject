// TrashDroppable.tsx
import { useDroppable } from "@dnd-kit/react";
import styles from "./Trash.module.css";

function TrashDroppable() {
  const { ref, isDropTarget } = useDroppable({
    id: "trash",
    type: "trash",
  });

  return (
    <div
      ref={ref}
      className={`${styles.trashDroppable} ${
        isDropTarget ? styles.trashDroppableTarget : styles.trashDroppableIdle
      }`}
    >
      Trash
    </div>
  );
}

export default TrashDroppable;
