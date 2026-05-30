import type { CardInstance, CardLocation } from "../state/binderTypes";
import {useDroppable} from "@dnd-kit/react";
import BinderCard from "./BinderCard";
import styles from "./BinderSlot.module.css";
import { useEffect } from "react";

type BinderSlotProps = {
    active: boolean;
    instance: CardInstance | null;
    index: number;
    onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
}

function BinderSlot({active, instance, index, onCardClick}: BinderSlotProps) {
    const {droppable, ref: ref } = useDroppable({
        id: `slot-${index}`,
        data: { index },
        disabled: !active,
        type: "binder-droppable",
    });

    useEffect(() => {
        // Page changes during a drag require newly visible slots to be remeasured.
        if (active) {
            droppable.refreshShape();
        }
    }, [active, droppable]);

    return (
        <div ref={ref} className={styles.binderSlot}>
            {instance && <BinderCard instance={instance} index={index} onCardClick={onCardClick} />}
            {!instance && <p className={styles.slotIndex}>{index}</p>}
        </div>
    )
}

export default BinderSlot;
