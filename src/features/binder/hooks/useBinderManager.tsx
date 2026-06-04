import { useReducer } from "react";
import type { ScryfallCard } from "../../../types/scryfall";
import type { CardInstance, CardLocation, CardZone } from "../state/binderTypes";
import binderReducer, { initialBinderState } from "../state/binderReducer";
import handleCardClick from "../utils/handleCardClick";

function getCardAtLocation(
  binderCards: (CardInstance | null)[],
  tableauCards: CardInstance[],
  location: CardLocation
) {
  return location.zone === "binder"
    ? binderCards[location.index]
    : tableauCards[location.index];
}

export function useBinderManager() {
  const [state, dispatch] = useReducer(binderReducer, initialBinderState);
  const { tableauCards, binderCards, modalLocation } = state;

  const handleSelectCard = (card: ScryfallCard) => {
    dispatch({ type: "cardSearchSelect", card });
  };

  const closeModal = () => {
    dispatch({ type: "closeModal" });
  };

  const openModal = (location: CardLocation) => {
    dispatch({ type: "openModal", location });
  };

  const handleCardInteraction = (
    location: CardLocation,
    event: React.MouseEvent
  ) => {
    const cardInstance = getCardAtLocation(binderCards, tableauCards, location);
    if (!cardInstance) return;

    handleCardClick({
      cardInstance,
      event,
      location,
      onFlipCard: (location) => dispatch({ type: "flipCard", location }),
      onOpenModal: (location) => dispatch({ type: "openModal", location }),
    });
  };

  const handleCardSave = (card: CardInstance) => {
    // The modal edits a card snapshot; its original location stays in reducer state.
    if (!modalLocation) return;
    dispatch({ type: "saveModalCard", card: card, location: modalLocation });
  };

  const handleFlipCard = (location: CardLocation) => {
    dispatch({ type: "flipCard", location });
  };

  const handleTrashCard = (location: CardLocation) => {
    dispatch({ type: "trashCard", source: location });
  };

  const handleToBinder = (sourceIndex: number, targetIndex: number) => {
    dispatch({
      type: "moveTableauToBinder",
      source: { zone: "tableau", index: sourceIndex },
      target: { zone: "binder", index: targetIndex },
    });
  };

  const handleToTableau = (sourceIndex: number) => {
    dispatch({
      type: "moveBinderToTableau",
      source: { zone: "binder", index: sourceIndex },
    });
  };

  const handleBinderMove = (sourceIndex: number, targetIndex: number) => {
    dispatch({
      type: "moveBinderCard",
      source: { zone: "binder", index: sourceIndex },
      target: { zone: "binder", index: targetIndex },
    });
  };

  const handleToTrash = (
    sourceType: string | undefined,
    sourceIndex: number
  ) => {
    if (sourceType === "binder-draggable") {
      dispatch({
        type: "trashCard",
        source: { zone: "binder", index: sourceIndex },
      });
    }

    if (sourceType === "tableau-draggable") {
      dispatch({
        type: "trashCard",
        source: { zone: "tableau", index: sourceIndex },
      });
    }
  };

  const handleExport = () => {
    const data = {
      version: 1,
      cards: binderCards,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "binder.json";
    a.click();

    URL.revokeObjectURL(url);
  };

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

      if (data.cards.length !== binderCards.length) {
        throw new Error("Incompatible binder file");
      }

      dispatch({ type: "importBinder", cards: data.cards });
    } catch (error) {
      console.error("Could not import binder:", error);
    } finally {
      event.target.value = "";
    }
  };

  const clearTableau = () => {
    if (!window.confirm("Clear all cards from the tableau?")) return;
    dispatch({ type: "clearTableau" });
  };

  const handleUpdateCardAtLocation = (card: CardInstance, location: CardLocation) => {
    dispatch({ type: "updateCardAtLocation", card, location });
  }

  const handleMoveCardToZone = (source: CardLocation, targetZone: CardZone) => {
    dispatch({ type: "moveCardToZone", source, targetZone });
  }

  const handleDuplicateCard = (location: CardLocation) => {
    dispatch({ type: "duplicateCard", source: location });
  }

  return {
    tableauCards,
    binderCards,
    modalLocation,
    handleSelectCard,
    handleCardInteraction,
    handleCardSave,
    handleFlipCard,
    handleTrashCard,
    handleToBinder,
    handleToTableau,
    handleBinderMove,
    handleToTrash,
    closeModal,
    openModal,
    handleExport,
    handleImport,
    clearTableau,
    handleUpdateCardAtLocation,
    handleMoveCardToZone,
    handleDuplicateCard,
  };
}
