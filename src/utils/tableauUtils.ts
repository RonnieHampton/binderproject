import type { CardInstance } from "../types/scryfall";
import type { TableauRenderableCard, TableauSortMode } from "../types/tableau";
const CARD_TYPES = [
  "Creature",
  "Instant",
  "Sorcery",
  "Artifact",
  "Enchantment",
  "Planeswalker",
  "Battle",
  "Land",
  "Tribal",
];


function CreateInstance(card: CardInstance, sourceIndex: number): TableauRenderableCard {
  return {
    sourceIndex,
    instance: card
  };
}

function normalizeBucket(card: CardInstance, sortType: TableauSortMode) {
  if (sortType === "cmc") {
    return `Mana Value ${card.card.cmc}`;
  } else if (sortType === "color_identity") {
    return card.card.color_identity?.join('') || 'Colorless';
  } else if (sortType === "type_line") {
    for (const type of CARD_TYPES) {
      if (card.card.type_line?.includes(type)) {
        return type;
      }
    }
  } else if (sortType === "rarity") {
     return card.card.rarity || "unknown";
  } else if (sortType === "set") {
    return card.card.set_name || "unknown";
  }
  return "bwaerg";
}


export default function SortTableau(cards: CardInstance[], sortType: TableauSortMode) {
  // Implementation of sorting logic based on sortType
  const buckets = new Map<string, TableauRenderableCard[]>();
  
  for (const [sourceIndex, card] of cards.entries()) {
    const bucketName = normalizeBucket(card, sortType);
    const bucket = buckets.get(bucketName) ?? [];
    bucket.push(CreateInstance(card, sourceIndex));
    buckets.set(bucketName, bucket);
  }

  if (sortType === "cmc") {
    return [...buckets.entries()].map(([title, cards]) => ({
    id: title,
    title,
    sortValue: Number(cards[0].instance.card.cmc),
    cards
  })).sort((a, b) => (a.sortValue as number) - (b.sortValue as number));
  }

  return [...buckets.entries()].map(([title, cards]) => ({
    id: title,
    title,
    cards
  }));
}