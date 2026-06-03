import type { CardInstance, CardLocation } from "../state/binderTypes";
import getCardDisplayData from "../../cards/utils/getCardDisplayData";
import DisplayCard from "../../cards/components/DisplayCard";
import { useDraggable } from "@dnd-kit/react";
import styles from "./BinderCard.module.css";
import CardHoverOptions from "../../card-options/components/CardHoverOptions";
import CardFlipAnimation from "../../cards/components/CardFlipAnimation";
import { hasDistinctCardFaces } from "../../cards/utils/cardFaceUtils";

type BinderCardProps = {
    instance: CardInstance,
    index: number
    onCardClick: (location: CardLocation, event: React.MouseEvent) => void;
    onFlipCard: (location: CardLocation) => void;
    onTrashCard: (location: CardLocation) => void;
}

function BinderCard({ instance, index, onCardClick, onFlipCard, onTrashCard }: BinderCardProps) {
    const canFlip = hasDistinctCardFaces(instance.card);

    const {ref: ref } = useDraggable({
        id: `binder-${index}`,
        data: { index, card: instance },
        type: "binder-draggable",
    });
    return (
        <div
            ref={ref}
            className={styles.binderCard}
            data-card-hover-options-parent
            onClick={(e) => {onCardClick({ zone: "binder", index }, e)}}
        >
            <CardFlipAnimation face={instance.face}>
                {(displayFace) => (
                    <DisplayCard cardData={getCardDisplayData(instance)} size="normal" face={displayFace} />
                )}
            </CardFlipAnimation>
            <CardHoverOptions
                canFlip={canFlip}
                onFlip={() => onFlipCard({ zone: "binder", index })}
                onTrash={() => onTrashCard({ zone: "binder", index })}
            />
        </div>
    );
}

export default BinderCard;
