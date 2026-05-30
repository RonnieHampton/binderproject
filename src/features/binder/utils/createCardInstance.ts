import type { ScryfallCard } from "../../../types/scryfall";
import type { CardFace, CardInstance } from "../state/binderTypes";

export default function createCardInstance(
  card: ScryfallCard,
  face: CardFace = "front",
  id: string | null = null
): CardInstance {
  return {
    card,
    face,
    id: id ?? crypto.randomUUID(),
  };
}
