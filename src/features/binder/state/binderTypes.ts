import type { ScryfallCard } from "../../../types/scryfall";

export type CardFace = "front" | "back";

export type CardZone = "binder" | "tableau";

export type CardInstance = {
  card: ScryfallCard;
  face: CardFace;
  id: string;
};

export type ModalCard = {
  card: CardInstance | null;
  index: number;
  zone: CardZone;
};

