import type { ManaToken } from "../types/scryfall";

function parseManaCost(originalString: string): ManaToken[] {
    const manaSymbolRegex = /(\{[^}]+\})/g;
    return originalString.split(manaSymbolRegex).filter(Boolean).map((part) => {
        if (part.startsWith("{") && part.endsWith("}")) {
        return {
          type: "symbol",
          value: part.slice(1, -1),
        };
      }

      return {
        type: "text",
        value: part,
      };
    });
}

export default parseManaCost;