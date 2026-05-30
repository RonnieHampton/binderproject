import type { ScryfallCard } from "../../../types/scryfall";
import createCardInstance from "../utils/createCardInstance";
import type { CardInstance, CardLocation } from "./binderTypes";
import { BINDER_SIZE, TABLEAU_SIZE_LIMIT } from "../config/binderConfig";

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

    default:
      return state;
  }
}

export default binderReducer;
