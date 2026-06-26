import parseManaCost from "../utils/manaSymbolParser";
import type { ManaToken } from "../../../types/scryfall";
import styles from "./ManaText.module.css";

type ManaTextProps = {
  text?: string;
};

function ManaText({ text = "" }: ManaTextProps) {
  const parsedText: ManaToken[] = parseManaCost(text);

  return (
    <span className={styles.manaText}>
      {parsedText.map((token, index) => {
        if (token.type === "text") {
          return <span className={styles.textToken} key={index}>{token.value}</span>;
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
    </span>
  );
}

export default ManaText;
