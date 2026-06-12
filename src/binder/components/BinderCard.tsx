import type { CardInstance, CardLocation } from "../state/binderTypes";
import getCardDisplayData from "../../features/cards/utils/getCardDisplayData";
import DisplayCard from "../../features/cards/components/DisplayCard";
import getCardTooltip from "../../features/cards/utils/getCardTooltip";
import { useDraggable } from "@dnd-kit/react";
import styles from "./BinderCard.module.css";
import CardHoverOptions from "../../features/card-options/components/CardHoverOptions";
import CardFlipAnimation from "../../features/cards/components/CardFlipAnimation";
import { hasDistinctCardFaces } from "../../features/cards/utils/cardFaceUtils";
import type { BinderSettings } from "../types/binderSettings";

type BinderCardProps = {
    instance: CardInstance,
    index: number
    onCardClick: (location: CardLocation, event: React.MouseEvent<HTMLDivElement>) => void;
    onCardContextMenu: (location: CardLocation, event: React.MouseEvent<HTMLDivElement>) => void;
    onFlipCard: (location: CardLocation) => void;
    onTrashCard: (location: CardLocation) => void;
    onMouseEnter: (location: CardLocation) => void;
    onMouseLeave: () => void;
    settings: BinderSettings;
    dragAndDropEnabled: boolean;
}

function BinderCard({ instance, index, settings, dragAndDropEnabled, onCardClick, onCardContextMenu, onFlipCard, onTrashCard, onMouseEnter, onMouseLeave }: BinderCardProps) {
    const canFlip = hasDistinctCardFaces(instance.card);

    const {ref: ref } = useDraggable({
        id: `binder-${index}`,
        data: { index, card: instance },
        type: "binder-draggable",
        disabled: !dragAndDropEnabled
    });
    return (
        <div
            ref={ref}
            className={styles.binderCard}
            data-card-hover-options-parent
            onClick={(e) => {onCardClick({ zone: "binder", index }, e)}}
            onContextMenu={(e) => {onCardContextMenu({ zone: "binder", index }, e)}}
            title={settings.showCardTooltips ? getCardTooltip(instance) : undefined}
            onMouseEnter={() => onMouseEnter({ zone: "binder", index: index })}
            onMouseLeave={onMouseLeave}
        >
            <CardFlipAnimation face={instance.face}>
                {(displayFace) => (
                    <DisplayCard cardData={getCardDisplayData(instance)} size="normal" face={displayFace} />
                )}
            </CardFlipAnimation>
            {settings.showHoverControls && (
                <CardHoverOptions
                    canFlip={canFlip}
                    onFlip={() => onFlipCard({ zone: "binder", index })}
                    onTrash={() => onTrashCard({ zone: "binder", index })}
                />
            )}
        </div>
    );
}

export default BinderCard;
