import type { CardInstance } from "../../binder/state/binderTypes";
import getCardDisplayData from "../utils/getCardDisplayData";
import DisplayCard from "./DisplayCard";
import { useDraggable } from "@dnd-kit/react";

type BinderCardProps = {
    instance: CardInstance,
    index: number
    onCardClick: (index: number, event: React.MouseEvent) => void;
}

function BinderCard({ instance, index, onCardClick }: BinderCardProps) {
    const {ref: ref } = useDraggable({
        id: `binder-${index}`,
        data: { index, card: instance },
        type: "binder-draggable",
    });
    return (
        <div ref={ref} onClick={(e) => {onCardClick(index, e)}}>
            <DisplayCard cardData={getCardDisplayData(instance)} size="normal" face={instance.face} />
        </div>
    );
}

export default BinderCard;