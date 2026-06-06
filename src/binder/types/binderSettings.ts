export type BinderSettings = {
  keyboardShortcuts: boolean;
  confirmBeforeDelete: boolean;
  showHoverControls: boolean;
  clickCompatibilityMode: boolean;
  compactTableau: boolean;
  showCardTooltips: boolean;
  showEmptySlotNumbers: boolean;
};

export type UpdateBinderSetting = <K extends keyof BinderSettings>(
  key: K,
  value: BinderSettings[K]
) => void;
