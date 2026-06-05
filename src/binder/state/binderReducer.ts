import type { ScryfallCard } from "../../types/scryfall";
import createCardInstance from "../utils/createCardInstance";
import type { CardInstance, CardLocation, CardZone } from "./binderTypes";
import { BINDER_SIZE, TABLEAU_SIZE_LIMIT } from "../config/binderConfig";
import { hasDistinctCardFaces } from "../../features/cards/utils/cardFaceUtils";

// State
export type BinderState = {
  binderCards: (CardInstance | null)[];
  tableauCards: CardInstance[];
  modalLocation: CardLocation | null;
};

export const initialBinderState: BinderState = {
  binderCards: Array(BINDER_SIZE).fill(null),
  tableauCards: [],
  modalLocation: null,
};

// Actions
type BinderAction =
  // Search
  | {
      type: "cardSearchSelect";
      card: ScryfallCard;
    }

  // Modal
  | {
      type: "openModal";
      location: CardLocation;
    }
  | {
      type: "closeModal";
    }
  | {
      type: "saveModalCard";
      card: CardInstance;
      location: CardLocation;
    }

  // Card interactions
  | {
      type: "flipCard";
      location: CardLocation;
    }

  // Drag and drop
  | {
      type: "moveTableauToBinder";
      source: CardLocation;
      target: CardLocation;
    }
  | {
      type: "moveBinderToTableau";
      source: CardLocation;
    }
  | {
      type: "moveBinderCard";
      source: CardLocation;
      target: CardLocation;
    }
  | {
      type: "trashCard";
      source: CardLocation;
    }

  // Import
  | {
      type: "importBinder";
      cards: (CardInstance | null)[];
    }

  | {
      type: "clearTableau";
    }
  | {
      type: "updateCardAtLocation";
      card: CardInstance;
      location: CardLocation;
  }
  | {
      type: "moveCardToZone";
      source: CardLocation;
      targetZone: CardZone;
  }
  | {
      type: "duplicateCard";
      source: CardLocation;
  };

function binderReducer(state: BinderState, action: BinderAction): BinderState {
  switch (action.type) {
    // Search
    case "cardSearchSelect": {
      if (state.tableauCards.length >= TABLEAU_SIZE_LIMIT) return state;

      const newCard = createCardInstance(action.card, "front", null);
      return {
        ...state,
        tableauCards: [...state.tableauCards, newCard],
      };
    }

    // Modal
    case "openModal":
      return {
        ...state,
        modalLocation: action.location,
      };

    case "closeModal":
      return {
        ...state,
        modalLocation: null,
      };

    case "saveModalCard": {
      const nextCard = action.card;

      if (action.location.zone === "binder") {
        const binderCards = [...state.binderCards];
        binderCards[action.location.index] = nextCard;

        return {
          ...state,
          binderCards,
          modalLocation: null,
        };
      }

      if (action.location.zone === "tableau") {
        const tableauCards = [...state.tableauCards];
        tableauCards[action.location.index] = nextCard;

        return {
          ...state,
          tableauCards,
          modalLocation: null,
        };
      }

      return state;
    }

    // Card interactions
    case "flipCard": {
      const { zone, index } = action.location;

      if (zone === "binder") {
        const binderCards = [...state.binderCards];
        const card = binderCards[index];

        if (!card) return state;
        if (!hasDistinctCardFaces(card.card)) return state;

        binderCards[index] = {
          ...card,
          face: card.face === "front" ? "back" : "front",
        };

        return {
          ...state,
          binderCards,
        };
      }

      if (zone === "tableau") {
        const tableauCards = [...state.tableauCards];
        const card = tableauCards[index];

        if (!card) return state;
        if (!hasDistinctCardFaces(card.card)) return state;

        tableauCards[index] = {
          ...card,
          face: card.face === "front" ? "back" : "front",
        };

        return {
          ...state,
          tableauCards,
        };
      }

      return state;
    }

    // Drag and drop
    case "moveTableauToBinder": {
      const tableauCards = [...state.tableauCards];
      const binderCards = [...state.binderCards];
      const card = tableauCards[action.source.index];
      const displacedCard = binderCards[action.target.index];

      if (!card) return state;

      binderCards[action.target.index] = card;

      const filteredTableau = tableauCards.filter((_, i) => i !== action.source.index);
      // Replacing an occupied binder slot returns the displaced card to staging.
      if (displacedCard) {
        filteredTableau.push(displacedCard);
      }

      return {
        ...state,
        binderCards,
        tableauCards: filteredTableau,
      };


    }

    case "moveBinderToTableau": {
      const tableauCards = [...state.tableauCards];
      const binderCards = [...state.binderCards];
      const card = binderCards[action.source.index];

      if (!card) return state;
      if (state.tableauCards.length >= TABLEAU_SIZE_LIMIT) return state;

      binderCards[action.source.index] = null;
      tableauCards.push(card);

      return {
        ...state,
        binderCards,
        tableauCards,
      };
    }

    case "moveBinderCard": {
      const binderCards = [...state.binderCards];
      const card = binderCards[action.source.index];
      const displacedCard = binderCards[action.target.index];
      if (!card) return state;
      binderCards[action.target.index] = card;
      binderCards[action.source.index] = displacedCard ?? null;

      return {
        ...state,
        binderCards,
      };
    }

    case "trashCard": {
      if (action.source.zone === "binder") {
        const binderCards = [...state.binderCards];
        binderCards[action.source.index] = null;
        return {
          ...state,
          binderCards,
        };
      }

      if (action.source.zone === "tableau") {
        const tableauCards = [...state.tableauCards];
        tableauCards.splice(action.source.index, 1);
        return {
          ...state,
          tableauCards,
        };
      }

      return state;
    }

    // Import
    case "importBinder": {
      return {
        ...state,
        binderCards: action.cards,
        modalLocation: null,
      };
    }

    case "clearTableau": {
      return {
        ...state,
        tableauCards: [],
      };
    }

    case "updateCardAtLocation": {
      const { card, location } = action;
      if (location.zone === "binder") {
        const binderCards = [...state.binderCards];
        binderCards[location.index] = card;
        return {
          ...state,
          binderCards,
        };
      }

      if (location.zone === "tableau") {
        const tableauCards = [...state.tableauCards];
        tableauCards[location.index] = card;
        return {
          ...state,
          tableauCards,
        };
      }

      return state;
    }

    case "moveCardToZone": {
      const { source, targetZone } = action;
      if (targetZone === "binder") {
        const binderCards = [...state.binderCards];
        const tableauCards = [...state.tableauCards];
        const card = tableauCards[source.index];
        const freeCardIndex = binderCards.findIndex((c) => c === null);

        if (!card) return state;
        if (freeCardIndex === -1) return state;

        binderCards[freeCardIndex] = card;
        tableauCards.splice(source.index, 1);

        return {
          ...state,
          binderCards,
          tableauCards,
        };
      }

      if (targetZone === "tableau") {
        const binderCards = [...state.binderCards];
        const tableauCards = [...state.tableauCards];
        const card = binderCards[source.index];

        if (!card) return state;
        if (tableauCards.length >= TABLEAU_SIZE_LIMIT) return state;

        tableauCards.push(card);
        binderCards[source.index] = null;

        return {
          ...state,
          binderCards,
          tableauCards,
        };
      }

      return state;
    }

    case "duplicateCard": {
      const { source } = action;

      if (source.zone === "binder") {
        const binderCards = [...state.binderCards];
        const cardToDuplicate = binderCards[source.index];
        const freeCardIndex = binderCards.findIndex((c) => c === null);

        if (!cardToDuplicate) return state;
        if (freeCardIndex === -1) return state;
        
        const duplicatedCard = {
          ...cardToDuplicate,
          id: crypto.randomUUID(),
        };
        
        binderCards[freeCardIndex] = duplicatedCard;

        return {
          ...state,
          binderCards,
        };
      }

      if (source.zone === "tableau") {
        const tableauCards = [...state.tableauCards];
        const cardToDuplicate = tableauCards[source.index];

        if (!cardToDuplicate) return state;
        if (tableauCards.length >= TABLEAU_SIZE_LIMIT) return state;

        const duplicatedCard = {
          ...cardToDuplicate,
          id: crypto.randomUUID(),
        };

        tableauCards.push(duplicatedCard);

        return {
          ...state,
          tableauCards,
        };
      }

      return state;
    }

    default:
      return state;
  }
}

export default binderReducer;
