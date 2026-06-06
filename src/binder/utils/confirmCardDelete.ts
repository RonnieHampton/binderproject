export function confirmCardDelete(confirmBeforeDelete: boolean) {
  if (!confirmBeforeDelete) return true;

  return window.confirm("Are you sure you want to delete this card?");
}
