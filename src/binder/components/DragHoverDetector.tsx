import { useDroppable } from "@dnd-kit/react";
import styles from "./DragHoverDetector.module.css";

type DragHoverDetectorProps = {
  id: string;
  enabled?: boolean;
};

function DragHoverDetector({ id, enabled = true }: DragHoverDetectorProps) {
  const { ref } = useDroppable({
    id,
    type: "detector",
    disabled: !enabled,
  });

  return <div ref={ref} className={styles.dragHoverDetector} />;
}

export default DragHoverDetector;
