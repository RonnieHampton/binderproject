import type { ScryfallCard } from "../../types/scryfall";

export type CardFace = "front" | "back";

export type CardZone = "binder" | "tableau";

export type CardInstance = {
  card: ScryfallCard;
  face: CardFace;
  id: string;
};

export type CardLocation = {
  index: number;
  zone: CardZone;
};
