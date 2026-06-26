import type { ChangeEvent } from "react";
import styles from "./BinderFileControls.module.css";

type BinderFileControlsProps = {
  onExport: () => void;
  onImport: (event: ChangeEvent<HTMLInputElement>) => void;
};

function BinderFileControls({ onExport, onImport }: BinderFileControlsProps) {
  return (
    <div className={styles.fileControls}>
      <button className={styles.fileControlButton} type="button" onClick={onExport}>
        Export Binder
      </button>

      <label className={styles.fileControlButton}>
        Import Binder
        <input
          className={styles.importInput}
          type="file"
          accept="application/json,.json"
          onChange={onImport}
        />
      </label>
    </div>
  );
}

export default BinderFileControls;
