import type { CardInstance } from "../../../../binder/state/binderTypes";
import type { CardDetailsData } from "../types/cardOptionsTypes";

export function getCardDetailsData(instance: CardInstance): CardDetailsData {
  const card = instance.card;
  const selectedFace =
    instance.face === "front" ? card.card_faces?.[0] : card.card_faces?.[1];

  const shouldShowAllFaceText =
    Boolean(card.image_uris?.normal) && Boolean(card.card_faces?.length);

  const textBlocks = shouldShowAllFaceText
    ? card.card_faces?.map((face) => ({
      name: face.name,
      oracleText: face.oracle_text,
      flavorText: face.flavor_text,
    })) ?? []
    : [
      {
        name: undefined,
        oracleText: card.oracle_text ?? selectedFace?.oracle_text,
        flavorText: card.flavor_text ?? selectedFace?.flavor_text,
      },
    ];

  return {
    manaCost: card.mana_cost ?? selectedFace?.mana_cost,
    typeLine: card.type_line ?? selectedFace?.type_line,
    textBlocks,
    shouldShowAllFaceText,
  };
}
