import type { CardInstance, CardLocation } from "../state/binderTypes";
import {useDroppable} from "@dnd-kit/react";
import BinderCard from "./BinderCard";
import styles from "./BinderSlot.module.css";
import { useEffect } from "react";
import type { BinderSettings } from "../types/binderSettings";

type BinderSlotProps = {
    active: boolean;
    instance: CardInstance | null;
    index: number;
    onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
    onCardContextMenu: (location: CardLocation, event: React.MouseEvent) => void;
    onFlipCard: (location: CardLocation) => void;
    onTrashCard: (location: CardLocation) => void;
    onMouseEnter: (location: CardLocation) => void;
    onMouseLeave: () => void;
    selectedCard: CardLocation | null;
    settings: BinderSettings;
}

function BinderSlot({
    active, 
    instance, 
    index, 
    onCardClick, onCardContextMenu, onFlipCard, onTrashCard, onMouseEnter, onMouseLeave, selectedCard, settings}: BinderSlotProps) {
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
            {instance && <BinderCard 
                instance={instance} 
                index={index} 
                onCardClick={onCardClick} 
                onCardContextMenu={onCardContextMenu} 
                onFlipCard={onFlipCard} 
                onTrashCard={onTrashCard}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                selectedCard={selectedCard}
                settings={settings}
            />}
            {!instance && <p className={styles.slotIndex}>+</p>}
            {!instance && settings.showEmptySlotNumbers && <p className={styles.slotNumber}>{index + 1}</p>}
        </div>
    )
}

export default BinderSlot;
