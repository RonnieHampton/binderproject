import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { CardInstance, CardLocation } from "../state/binderTypes";
import { useEscapeToClose } from "./useEscapeToClose";

type UseBinderContextMenuArgs = {
  binderCards: (CardInstance | null)[];
  tableauCards: CardInstance[];
};

export function useBinderContextMenu({
  binderCards,
  tableauCards,
}: UseBinderContextMenuArgs) {
  const [contextMenu, setContextMenu] = useState<{
    location: CardLocation;
    x: number;
    y: number;
  } | null>(null);

  const contextMenuCard =
    contextMenu?.location.zone === "binder"
      ? binderCards[contextMenu.location.index]
      : contextMenu?.location.zone === "tableau"
        ? tableauCards[contextMenu.location.index]
        : null;

  const handleCardContextMenu = (
    location: CardLocation,
    event: MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      location,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEscapeToClose(contextMenu !== null, closeContextMenu);

  useEffect(() => {
    if (!contextMenu) return;

    document.addEventListener("click", closeContextMenu);

    return () => {
      document.removeEventListener("click", closeContextMenu);
    };
  }, [contextMenu]);

  return {
    contextMenu,
    contextMenuCard,
    handleCardContextMenu,
    closeContextMenu,
  };
}
