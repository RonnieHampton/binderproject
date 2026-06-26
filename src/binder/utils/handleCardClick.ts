import type { CardInstance, CardLocation } from "../state/binderTypes";

type CardClickProps = {
  cardInstance: CardInstance;
  event: React.MouseEvent;
  location: CardLocation;
  onDuplicateCard: (location: CardLocation) => void;
  onOpenModal: (location: CardLocation) => void;
};

function handleCardClick({
  cardInstance,
  event,
  location,
  onDuplicateCard,
  onOpenModal,
}: CardClickProps) {
  void cardInstance;

  if (event.ctrlKey) {
    event.preventDefault();
    event.stopPropagation();
    onDuplicateCard(location);
    return;
  }

  onOpenModal(location);
}

export default handleCardClick;
