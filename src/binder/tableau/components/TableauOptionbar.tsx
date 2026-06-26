import type { Dispatch, SetStateAction } from "react";
import type { TableauSortMode } from "../types/tableau";
import styles from "./TableauOptionbar.module.css";
import { TABLEAU_SIZE_LIMIT } from "../../config/binderConfig";

type TableauOptionbarProps = {
  sortMode: TableauSortMode;
  length: number;
  setSortMode: (mode: TableauSortMode) => void;
  setTrashVisible: Dispatch<SetStateAction<boolean>>;
  setTableauVisible: Dispatch<SetStateAction<boolean>>;
  multiselectEnabled: boolean;
  setMultiselectEnabled: Dispatch<SetStateAction<boolean>>;
  onClearTableau: () => void;
};

function TableauOptionbar({
  sortMode,
  length,
  setSortMode,
  setTrashVisible,
  setTableauVisible,
  onClearTableau,
}: TableauOptionbarProps) {
  return (
    <div className={styles.optionbar}>
      <select
        className={styles.sortSelect}
        value={sortMode}
        onChange={(e) => setSortMode(e.target.value as TableauSortMode)}
      >
        <option value="cmc">Mana Value</option>
        <option value="color_identity">Color Identity</option>
        <option value="type_line">Type</option>
        <option value="rarity">Rarity</option>
        <option value="set">Set</option>
      </select>

      <button
        className={styles.optionButton}
        type="button"
        onClick={() => setTrashVisible((prev) => !prev)}
      >
        Trash
      </button>

      <button
        className={styles.optionButton}
        type="button"
        onClick={() => setTableauVisible((prev) => !prev)}
      >
        Hide Tableau
      </button>

      <button
        className={styles.clearButton}
        type="button"
        onClick={onClearTableau}
        disabled={length === 0}
      >
        Clear Tableau
      </button>

      <span className={styles.cardCount}>
        {`Cards: ${length}/${TABLEAU_SIZE_LIMIT}`}
      </span>
    </div>
  );
}

export default TableauOptionbar;
