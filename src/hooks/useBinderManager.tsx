// src/hooks/useBinderCards.ts
import { useState } from "react";
import type { CardInstance, ScryfallCard, ModalCard } from "../types/scryfall";

const BINDER_SIZE = 60;

function createCardInstance(card: ScryfallCard, face: "front" | "back", UUID: string | null): CardInstance {
  return {
    card,
    face: face ?? "front",
    id: UUID ?? crypto.randomUUID(),
  };
}

export function useBinderManager() {
  const [tableauCards, setTableauCards] = useState<CardInstance[]>([]);
  const [binderCards, setBinderCards] = useState<(CardInstance | null)[]>(
    Array(BINDER_SIZE).fill(null)
  );
  const [modalCard, setModalCard] = useState<ModalCard | null>(null);

  const handleSelectCard = (card: ScryfallCard) => {
    const newCard = createCardInstance(card, "front", null);
    setTableauCards((prev) => [...prev, newCard]);
  };

  const closeModal = () => {
    setModalCard(null);
  };

  const handleCtrlClick = (card: CardInstance, index: number, zone: string) => {
    if (zone === "binder") {
      setBinderCards((prev) => {
        const next = [...prev];
        if (card.face === "front") {
          next[index] = { ...card, face: "back" };
        } else {
          next[index] = { ...card, face: "front" };
        }
        return next;
      });
    }
  };

  const handleModalSelect = (
    card: CardInstance | null,
    index: number,
    zone: string
  ) => {
    setModalCard({ card, index, zone });
  };

  const handleCardSave = (
    changedCard: ScryfallCard,
    index: number,
    zone: string,
    face: string
  ) => {
    const card = createCardInstance(changedCard, face as "front" | "back", changedCard?.id);

    if (zone === "binder") {
      setBinderCards((prev) => {
        const next = [...prev];
        next[index] = card;
        return next;
      });
    } else if (zone === "tableau") {
      setTableauCards((prev) => {
        const next = [...prev];
        next[index] = card;
        return next;
      });
    }

    closeModal();
  };

  const handleToBinder = (sourceIndex: number, targetIndex: number) => {
    const neededCard = tableauCards[sourceIndex];
    if (!neededCard) return;

    const displacedCard = binderCards[targetIndex];

    setBinderCards((prevBinder) => {
      const nextBinder = [...prevBinder];
      nextBinder[targetIndex] = neededCard;
      return nextBinder;
    });

    setTableauCards((prevTableau) => {
      const nextTableau = prevTableau.filter((_, i) => i !== sourceIndex);

      if (displacedCard) {
        nextTableau.push(displacedCard);
      }

      return nextTableau;
    });
  };

  const handleToTableau = (sourceIndex: number) => {
    const neededCard = binderCards[sourceIndex];
    if (!neededCard) return;

    setBinderCards((prev) => {
      const next = [...prev];
      next[sourceIndex] = null;
      return next;
    });

    setTableauCards((prev) => [...prev, neededCard]);
  };

  const handleBinderMove = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;

    setBinderCards((prev) => {
      const next = [...prev];

      const neededCard = next[sourceIndex];
      if (!neededCard) return prev;

      const oldCard = next[targetIndex];

      next[sourceIndex] = oldCard ?? null;
      next[targetIndex] = neededCard;

      return next;
    });
  };

  const handleToTrash = (
    sourceType: string | undefined,
    sourceIndex: number
  ) => {
    if (sourceType === "binder-draggable") {
      setBinderCards((prev) => {
        const next = [...prev];
        next[sourceIndex] = null;
        return next;
      });

      return;
    }

    if (sourceType === "tableau-draggable") {
      setTableauCards((prev) => prev.filter((_, i) => i !== sourceIndex));
    }
  };

  const handleExport = () => {
    const data = {
        version: 1,
        cards: binderCards
    }

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "binder.json";
    a.click();

    URL.revokeObjectURL(url);
  }

    const handleImport = async (
        event: React.ChangeEvent<HTMLInputElement>
        ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (data.version !== 1 || !Array.isArray(data.cards)) {
            throw new Error("Invalid binder file");
            }

            setBinderCards(data.cards);
        } catch (error) {
            console.error("Could not import binder:", error);
        } finally {
            event.target.value = "";
    }
    };

  return {
    tableauCards,
    binderCards,
    modalCard,
    handleSelectCard,
    handleModalSelect,
    handleCardSave,
    handleToBinder,
    handleToTableau,
    handleBinderMove,
    handleToTrash,
    closeModal,
    handleExport,
    handleImport,
    handleCtrlClick
  };
}