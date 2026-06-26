import styles from "./BinderSidePanel.module.css";
import type { BinderSettings, UpdateBinderSetting } from "../types/binderSettings";

type BinderSidePanelProps = {
  settings: BinderSettings;
  sidePanelOpen: boolean;
  setSidePanelOpen: (open: boolean) => void;
  updateSetting: UpdateBinderSetting;
};

function BinderSidePanel({ settings, sidePanelOpen, setSidePanelOpen, updateSetting }: BinderSidePanelProps) {
  return (
    <div className={styles.binderSidePanel}>
      {!sidePanelOpen && (<button
        className={styles.menuButton}
        type="button"
        aria-label="Open binder options"
        onClick={() => setSidePanelOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>)}

      {sidePanelOpen && (
        <div className={styles.sidePanel}>
          <button
            aria-label="Close binder options"
            onClick={() => setSidePanelOpen(false)}
            className={styles.closeButton}
            type="button"
          />

          <aside className={styles.sidePanelContent}>
            <div className={styles.shortcutList}>
              <h2>Shortcuts</h2>

              <div className={styles.shortcutRow}>
                <kbd>Click card</kbd>
                <span>Open details</span>
              </div>
              <div className={styles.shortcutRow}>
                <kbd>Ctrl-click</kbd>
                <span>Duplicate card</span>
              </div>
              <div className={styles.shortcutRow}>
                <kbd>Right-click</kbd>
                <span>Open context menu</span>
              </div>
              <div className={styles.shortcutRow}>
                <kbd>F</kbd>
                <span>Flip card</span>
              </div>
              <div className={styles.shortcutRow}>
                <kbd>D</kbd>
                <span>Duplicate card</span>
              </div>
              <div className={styles.shortcutRow}>
                <kbd>M</kbd>
                <span>Move to binder/tableau</span>
              </div>
              <div className={styles.shortcutRow}>
                <kbd>Delete</kbd>
                <span>Delete card</span>
              </div>
              <div className={styles.shortcutRow}>
                <kbd>Enter</kbd>
                <span>Open details</span>
              </div>
              <div className={styles.shortcutRow}>
                <kbd>Esc</kbd>
                <span>Close menu</span>
              </div>
            </div>

            <section className={styles.settingsSection}>
              <h2>Settings</h2>

              <label className={styles.settingRow}>
                <input type="checkbox" checked={settings.keyboardShortcuts} onChange={(e) =>
                  updateSetting('keyboardShortcuts', e.target.checked)} />
                Enable keyboard shortcuts
              </label>

              <label className={styles.settingRow}>
                <input type="checkbox" checked={settings.confirmBeforeDelete} onChange={(e) =>
                  updateSetting('confirmBeforeDelete', e.target.checked)} />
                Confirm before delete
              </label>

              <label className={styles.settingRow}>
                <input type="checkbox" checked={settings.showHoverControls} onChange={(e) =>
                  updateSetting('showHoverControls', e.target.checked)} />
                Show hover controls
              </label>

              <label className={styles.settingRow}>
                <input type="checkbox" checked={settings.clickCompatibilityMode} onChange={(e) =>
                  updateSetting('clickCompatibilityMode', e.target.checked)} />
                Click only compatibility mode
              </label>

              <label className={styles.settingRow}>
                <input type="checkbox" checked={settings.showCardTooltips}
                  onChange={(e) => updateSetting('showCardTooltips', e.target.checked)} />
                Show card tooltips
              </label>

              <label className={styles.settingRow}>
                <input type="checkbox" checked={settings.showEmptySlotNumbers}
                  onChange={(e) => updateSetting('showEmptySlotNumbers', e.target.checked)} />
                Show empty slot numbers
              </label>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

export default BinderSidePanel;
