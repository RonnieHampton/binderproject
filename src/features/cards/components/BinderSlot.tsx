import type { CardInstance } from "../../binder/state/binderTypes";
import {useDroppable} from "@dnd-kit/react";
import BinderCard from "./BinderCard";
import styles from "./BinderSlot.module.css";

type BinderSlotProps = {
    instance: CardInstance | null;
    index: number;
    onCardClick: (index: number, event: React.MouseEvent) => void;
}

function BinderSlot({instance, index, onCardClick}: BinderSlotProps) {
    const {ref: ref } = useDroppable({
        id: `slot-${index}`,
        data: { index },
        type: "binder-droppable",
    });

    return (
        <div ref={ref} className={styles.binderSlot}>
            {instance && <BinderCard instance={instance} index={index} onCardClick={onCardClick} />}
            {!instance && <p className={styles.slotIndex}>{index}</p>}
        </div>
    )
}

export default BinderSlot;
