import type { ScryfallCard } from "../../../types/scryfall";

export function hasDistinctCardFaces(card: ScryfallCard) {
  return Boolean(
    card.card_faces?.[0]?.image_uris &&
    card.card_faces?.[1]?.image_uris
  );
}
