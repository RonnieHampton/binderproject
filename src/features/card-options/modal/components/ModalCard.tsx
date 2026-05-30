import type { CardInstance } from "../../../binder/state/binderTypes";
import DisplayCard from "../../../cards/components/DisplayCard";
import getCardDisplayData from "../../../cards/utils/getCardDisplayData";

type ModalCardProps = {
  instance: CardInstance;
  onCardClick: (instance: CardInstance) => void;
}
function ModalCard({instance, onCardClick}: ModalCardProps) {
    return (

        <div onClick={() => onCardClick(instance)}>
            <DisplayCard cardData={getCardDisplayData(instance)} size="large" face={instance.face} />
        </div>
    )
}

export default ModalCard;
