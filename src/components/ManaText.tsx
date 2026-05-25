import parseManaCost from "../utils/manaSymbolParser";
import type { ManaToken } from "../types/scryfall";

type ManaTextProps = {
  text?: string;
};

function ManaText({ text = "" }: ManaTextProps) {
  const parsedText: ManaToken[] = parseManaCost(text);

  return (
    <>
      {parsedText.map((token, index) => {
        if (token.type === "text") {
          return <span key={index}>{token.value}</span>;
        }

        return (
          <img
            key={index}
            src={`https://svgs.scryfall.io/card-symbols/${token.value.replace("/", "")}.svg`}
            alt={token.value}
            style={{
              width: "1em",
              height: "1em",
              verticalAlign: "middle",
            }}
          />
        );
      })}
    </>
  );
}

export default ManaText;