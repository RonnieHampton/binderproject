import { useState } from "react";
import type { CardLocation } from "../state/binderTypes";
import type { BinderSettings } from "../types/binderSettings";

export function useBinderSelectionTarget(settings: BinderSettings) {
  const [selectedCard, setSelectedCard] = useState<CardLocation | null>(null);
  const [targetCard, setTargetCard] = useState<CardLocation | null>(null);

  const selectionUsesExplicitMode =
    settings.keyboardOnlyMode || settings.clickCompatibilityMode;

  const handleCardHoverStart = (location: CardLocation) => {
    if (selectionUsesExplicitMode) return;

    setSelectedCard(location);
  };

  const handleCardHoverEnd = () => {
    if (selectionUsesExplicitMode) return;

    setSelectedCard(null);
  };

  return {
    selectedCard,
    setSelectedCard,
    targetCard,
    setTargetCard,
    handleCardHoverStart,
    handleCardHoverEnd,
  };
}
