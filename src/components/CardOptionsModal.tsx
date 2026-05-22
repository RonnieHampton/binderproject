import type { CardInstance } from "../types/scryfall";

type CardOptionsModalProps = {
    card: CardInstance;
    index: number;
    handleSave: (changedCard: CardInstance, index: number) => void;
};

function CardOptionsModal({ card, index }: CardOptionsModalProps) {
    console.log(card, index);
  return (
    <div>
        <section className="card-image"></section>
        <section className="card-details"></section>
        <section className="card-printings"></section>
    </div>
  );
}

export default CardOptionsModal;