import { useEffect, useState } from "react";
import { fetchPrintings } from "../../../../api/scryfall";
import type { ScryfallCard } from "../../../../types/scryfall";

export default function useCardPrintings(uri?: string) {
  const [printings, setPrintings] = useState<ScryfallCard[]>([]);

  useEffect(() => {
    async function loadPrintings() {
      if (!uri) {
        setPrintings([]);
        return;
      }

      const nextPrintings = await fetchPrintings(uri);
      setPrintings(nextPrintings);
    }

    loadPrintings();
  }, [uri]);

  return printings;
}
