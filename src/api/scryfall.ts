import type {
  ScryfallCard,
} from "../types/scryfall"

export async function fetchCards(
  searchTerm: string
): Promise<ScryfallCard[]> {

  const response = await fetch(
    `https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchTerm)}`
  )

  if (!response.ok) {
    return []
  }

  const json = (await response.json())

  return json.data
}

export async function fetchPrintings(
  uri: string
): Promise<ScryfallCard[]> {
  const response = await fetch(uri);

  if (!response.ok) {
    return [];
  }

  const json = await response.json();
  return json.data;
}