import type { CardInstance, CardLocation } from "../state/binderTypes";
import { hasDistinctCardFaces } from "../../cards/utils/cardFaceUtils";

type CardClickProps = {
  cardInstance: CardInstance;
  event: React.MouseEvent;
  location: CardLocation;
  onFlipCard: (location: CardLocation) => void;
  onOpenModal: (location: CardLocation) => void;
};

function handleCardClick({
  cardInstance,
  event,
  location,
  onFlipCard,
  onOpenModal,
}: CardClickProps) {
  const canFlipCard = hasDistinctCardFaces(cardInstance.card);

  if (event.ctrlKey && canFlipCard) {
    event.preventDefault();
    event.stopPropagation();
    onFlipCard(location);
    return;
  }

  onOpenModal(location);
}

export default handleCardClick;
