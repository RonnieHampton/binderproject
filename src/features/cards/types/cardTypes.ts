export type CardSize = "small" | "normal" | "large";

export type CardFace = "front" | "back";

export type CardImageUris = Partial<Record<CardSize, string>>;

export type CardDisplayData = {
  default?: CardImageUris;
  front?: CardImageUris;
  back?: CardImageUris;
  name: string;
};