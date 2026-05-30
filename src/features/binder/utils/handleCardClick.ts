import type { CardInstance, CardLocation } from "../state/binderTypes";

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
  const canFlipCard = cardInstance.card.card_faces?.length === 2;

  if (event.ctrlKey && canFlipCard) {
    event.preventDefault();
    event.stopPropagation();
    onFlipCard(location);
    return;
  }

  onOpenModal(location);
}

export default handleCardClick;