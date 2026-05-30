import type { ScryfallCard } from "../../../../types/scryfall";
import type { CardInstance } from "../../../binder/state/binderTypes";

export type CardTextBlock = {
  name?: string;
  oracleText?: string;
  flavorText?: string;
};

export type CardDetailsData = {
  manaCost?: string;
  typeLine?: string;
  textBlocks: CardTextBlock[];
  shouldShowAllFaceText: boolean;
};

export type CardOptionsModalProps = {
  card: CardInstance;
  handleSave: (card: CardInstance) => void;
};

export type CardPrintingListProps = {
  instance: CardInstance;
  handlePrintingClick: (printing: ScryfallCard) => void;
};

export type CardModalActionsProps = {
  onReset: () => void;
  onSave: () => void;
};
