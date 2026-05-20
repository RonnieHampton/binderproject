// TrashDroppable.tsx
import { useDroppable } from "@dnd-kit/react";

function TrashDroppable() {
  const { ref, isDropTarget } = useDroppable({
    id: "trash",
    type: "trash",
  });

  return (
    <div
      ref={ref}
      style={{
        width: "140px",
        height: "80px",
        border: "2px dashed crimson",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDropTarget ? "#ffcccc" : "#fff0f0",
        color: "crimson",
        fontWeight: "bold",
        margin: "1rem auto",
      }}
    >
      Trash
    </div>
  );
}

export default TrashDroppable;