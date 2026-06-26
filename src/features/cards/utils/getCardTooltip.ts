import type { CardInstance } from "../../../binder/state/binderTypes";

export default function getCardTooltip(instance: CardInstance) {
  const { card } = instance;
  const lines = [
    card.name,
    `${card.set?.toUpperCase() ?? "Unknown set"} · ${card.collector_number ?? "Unknown number"}`,
    card.type_line,
  ];

  if (typeof card.cmc === "number") {
    lines.push(`Mana value ${card.cmc}`);
  }

  return lines.filter(Boolean).join("\n");
}
