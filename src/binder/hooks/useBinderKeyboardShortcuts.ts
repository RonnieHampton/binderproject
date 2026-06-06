import { useEffect } from "react";
import type { CardLocation } from "../state/binderTypes";
import { confirmCardDelete } from "../utils/confirmCardDelete";

type UseBinderKeyboardShortcutsArgs = {
  enabled: boolean;
  selectedCard: CardLocation | null;
  confirmBeforeDelete: boolean;
  onFlipCard: (location: CardLocation) => void;
  onDuplicateCard: (location: CardLocation) => void;
  onTrashCard: (location: CardLocation) => void;
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
  confirmBeforeDelete,
  onFlipCard,
  onDuplicateCard,
  onTrashCard,
  onMoveCardToZone,
  onOpenDetails,
}: UseBinderKeyboardShortcutsArgs) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      void event;
      if (!enabled || !selectedCard) return;
      if (isTypingTarget(event.target)) return;

      switch (event.key) {
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
    confirmBeforeDelete,
    onFlipCard,
    onDuplicateCard,
    onTrashCard,
    onMoveCardToZone,
    onOpenDetails,
  ]);
}
