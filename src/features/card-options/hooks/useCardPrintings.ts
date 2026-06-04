import { useEffect, useState } from "react";
import { fetchPrintings } from "../../../api/scryfall";
import type { ScryfallCard } from "../../../types/scryfall";

type SearchStatus = "idle" | "loading" | "success" | "error";

export default function useCardPrintings(uri?: string) {
  const [printings, setPrintings] = useState<ScryfallCard[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadPrintings() {
      if (!uri) {
        setPrintings([]);
        setStatus("idle");
        setErrorMessage("");
        return;
      }

      setStatus("loading");
      setErrorMessage("");

      const result = await fetchPrintings(uri);

      if (!isCurrentRequest) return;

      if (result.status === "error") {
        setPrintings([]);
        setErrorMessage(result.message);
        setStatus("error");
        return;
      }

      setPrintings(result.data);
      setStatus("success");
    }

    loadPrintings();

    return () => {
      isCurrentRequest = false;
    };
  }, [uri]);

  return {
    printings,
    status,
    errorMessage,
  };
}
