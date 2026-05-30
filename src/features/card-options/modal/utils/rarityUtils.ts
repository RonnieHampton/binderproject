type RarityClassNames = {
  default: string;
  common: string;
  uncommon: string;
  rare: string;
  mythic: string;
};

export function getRarityClassName(
  rarity: string | undefined,
  classNames: RarityClassNames
) {
  if (!rarity || !(rarity in classNames)) return classNames.default;

  return classNames[rarity as keyof Omit<RarityClassNames, "default">];
}

export function getRarityLabel(rarity: string) {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}
