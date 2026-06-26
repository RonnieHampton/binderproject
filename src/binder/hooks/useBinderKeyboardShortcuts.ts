import { useEffect } from "react";
import type { CardLocation } from "../state/binderTypes";
import { confirmCardDelete } from "../utils/confirmCardDelete";

type UseBinderKeyboardShortcutsArgs = {
  enabled: boolean;
  selectedCard: CardLocation | null;
  targetCard: CardLocation | null;
  setSelectedCard: (location: CardLocation | null) => void;
  setTargetCard: (location: CardLocation | null) => void;
  clickCompatibilityMode: boolean;
  confirmBeforeDelete: boolean;
  onFlipCard: (location: CardLocation) => void;
  onDuplicateCard: (location: CardLocation) => void;
  onTrashCard: (location: CardLocation) => void;
  onMoveTableauToBinder: (sourceIndex: number, targetIndex: number) => void;
  onMoveBinderCard: (sourceIndex: number, targetIndex: number) => void;
  onMoveCardToZone: (from: CardLocation, toZone: CardLocation["zone"]) => void;
  onOpenDetails: (location: CardLocation) => void;
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']")
  );
}

export function useBinderKeyboardShortcuts({
  enabled,
  selectedCard,
  targetCard,
  setSelectedCard,
  setTargetCard,
  clickCompatibilityMode,
  confirmBeforeDelete,
  onFlipCard,
  onDuplicateCard,
  onTrashCard,
  onMoveTableauToBinder,
  onMoveBinderCard,
  onMoveCardToZone,
  onOpenDetails,
}: UseBinderKeyboardShortcutsArgs) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      void event;
      if (!enabled || !selectedCard) return;
      if (isTypingTarget(event.target)) return;

      switch (event.key) {
        case "Insert":
          if (!clickCompatibilityMode || targetCard?.zone !== "binder") return;

          event.preventDefault();

          if (selectedCard.zone === "tableau") {
            onMoveTableauToBinder(selectedCard.index, targetCard.index);
            setSelectedCard(targetCard);
            setTargetCard(null);
          }

          if (selectedCard.zone === "binder") {
            onMoveBinderCard(selectedCard.index, targetCard.index);
            setSelectedCard(targetCard);
            setTargetCard(null);
          }

          break;
        case "f":
          onFlipCard(selectedCard);
          break;
        case "d":
          onDuplicateCard(selectedCard);
          break;
        case "Delete":
        case "Backspace":
          if (!confirmCardDelete(confirmBeforeDelete)) return;

          onTrashCard(selectedCard);
          setSelectedCard(null);
          break;
        case "m":
          onMoveCardToZone(selectedCard, selectedCard.zone === "binder" ? "tableau" : "binder");
          break;
        case "Enter":
          onOpenDetails(selectedCard);
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    enabled,
    selectedCard,
    targetCard,
    setSelectedCard,
    setTargetCard,
    clickCompatibilityMode,
    confirmBeforeDelete,
    onFlipCard,
    onDuplicateCard,
    onTrashCard,
    onMoveTableauToBinder,
    onMoveBinderCard,
    onMoveCardToZone,
    onOpenDetails,
  ]);
}
