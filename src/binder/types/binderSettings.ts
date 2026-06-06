export type BinderSettings = {
  keyboardShortcuts: boolean;
  keyboardOnlyMode: boolean;
  confirmBeforeDelete: boolean;
  showHoverControls: boolean;
  clickCompatibilityMode: boolean;
  showCardTooltips: boolean;
  showEmptySlotNumbers: boolean;
};

export type UpdateBinderSetting = <K extends keyof BinderSettings>(
  key: K,
  value: BinderSettings[K]
) => void;
