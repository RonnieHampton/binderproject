import parseManaCost from "../utils/manaSymbolParser";
import type { ManaToken } from "../../../types/scryfall";
import styles from "./ManaText.module.css";

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
            className={styles.manaSymbol}
            key={index}
            src={`https://svgs.scryfall.io/card-symbols/${token.value.replace("/", "")}.svg`}
            alt={token.value}
          />
        );
      })}
    </>
  );
}

export default ManaText;
