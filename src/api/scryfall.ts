import type {
  ScryfallCard,
} from "../types/scryfall"

const SCRYFALL_TIMEOUT_MS = 10000;

export type ApiResult<T> =
  | {
      status: "success"; 
      data: T;
    }
  | {
      status: "error";
      data: T;
      message: string;
    };

async function fetchWithTimeout(uri: string) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    SCRYFALL_TIMEOUT_MS
  );

  try {
    return await fetch(uri, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export async function fetchCards(
  searchTerm: string
): Promise<ApiResult<ScryfallCard[]>> {
  try {
    const response = await fetchWithTimeout(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      return {
        status: "error",
        data: [],
        message: "Could not fetch cards",
      };
    }

    const json = await response.json();

    return {
      status: "success",
      data: json.data,
    };
  } catch (error) {
    return {
      status: "error",
      data: [],
      message: isAbortError(error)
        ? "Search timed out. Try again in a moment."
        : "Could not fetch cards",
    };
  }
}

export async function fetchPrintings(
  uri: string
): Promise<ApiResult<ScryfallCard[]>> {
  try {
    const response = await fetchWithTimeout(uri);

    if (!response.ok) {
      return {
        status: "error",
        data: [],
        message: "Could not fetch printings",
      };
    }

    const json = await response.json();

    return {
      status: "success",
      data: json.data,
    };
  } catch (error) {
    return {
      status: "error",
      data: [],
      message: isAbortError(error)
        ? "Printings timed out. Try again in a moment."
        : "Could not fetch printings",
    };
  }
}
