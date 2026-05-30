import type {CardInstance} from '../../binder/state/binderTypes'

export type TableauSortMode =
  | "cmc"
  | "color_identity"
  | "type_line"
  | "rarity"
  | "set";

export type TableauColumn = {
  id: string;
  title: string;
  sortValue?: number | string;
  cards: CardInstance[];
};

export type TableauRenderableCard = {
  sourceIndex: number;
  instance: CardInstance;
};
