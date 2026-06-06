import type { CardLocation } from "../state/binderTypes";
import { confirmCardDelete } from "../utils/confirmCardDelete";

type UseConfirmedCardDeleteArgs = {
  confirmBeforeDelete: boolean;
  onTrashCard: (location: CardLocation) => void;
  onTrashDraggedCard: (
    sourceType: string | undefined,
    sourceIndex: number
  ) => void;
};

export function useConfirmedCardDelete({
  confirmBeforeDelete,
  onTrashCard,
  onTrashDraggedCard,
}: UseConfirmedCardDeleteArgs) {
  const handleConfirmedTrashCard = (location: CardLocation) => {
    if (!confirmCardDelete(confirmBeforeDelete)) return;

    onTrashCard(location);
  };

  const handleConfirmedDraggedCardTrash = (
    sourceType: string | undefined,
    sourceIndex: number
  ) => {
    if (!confirmCardDelete(confirmBeforeDelete)) return;

    onTrashDraggedCard(sourceType, sourceIndex);
  };

  return {
    handleConfirmedTrashCard,
    handleConfirmedDraggedCardTrash,
  };
}
