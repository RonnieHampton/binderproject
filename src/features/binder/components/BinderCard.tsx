import type { CardInstance, CardLocation } from "../state/binderTypes";
import getCardDisplayData from "../../cards/utils/getCardDisplayData";
import DisplayCard from "../../cards/components/DisplayCard";
import { useDraggable } from "@dnd-kit/react";
import styles from "./BinderCard.module.css";

type BinderCardProps = {
    instance: CardInstance,
    index: number
    onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
}

function BinderCard({ instance, index, onCardClick }: BinderCardProps) {
    const {ref: ref } = useDraggable({
        id: `binder-${index}`,
        data: { index, card: instance },
        type: "binder-draggable",
    });
    return (
        <div
            ref={ref}
            className={styles.binderCard}
            onClick={(e) => {onCardClick({ zone: "binder", index }, e)}}
        >
            <DisplayCard cardData={getCardDisplayData(instance)} size="normal" face={instance.face} />
        </div>
    );
}

export default BinderCard;
