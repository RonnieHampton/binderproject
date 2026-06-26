import type { CardInstance } from "../state/binderTypes";

type DragOperationData = {
  card?: CardInstance | null;
  index?: number;
};

type BinderDragEvent = {
  canceled?: boolean;
  operation: {
    source?: {
      type?: unknown;
      data?: DragOperationData;
    } | null;
    target?: {
      id?: unknown;
      type?: unknown;
      data?: DragOperationData;
    } | null;
  };
};

type HandleBinderDragOverArgs = {
  event: BinderDragEvent;
  page: number;
  maxPage: number;
  pageChangeInterval: number;
  hoverInterval: React.MutableRefObject<number | null>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  clearHoverInterval: () => void;
};

type HandleBinderDragStartArgs = {
  event: BinderDragEvent;
  setOverlayCard: React.Dispatch<React.SetStateAction<CardInstance | null>>;
};

type HandleBinderDragEndArgs = {
  event: BinderDragEvent;
  handleToBinder: (sourceIndex: number, targetIndex: number) => void;
  handleToTableau: (sourceIndex: number) => void;
  handleBinderMove: (sourceIndex: number, targetIndex: number) => void;
  handleToTrash: (sourceType: string | undefined, sourceIndex: number) => void;
  clearHoverInterval: () => void;
  setOverlayCard: React.Dispatch<React.SetStateAction<CardInstance | null>>;
};

export function handleBinderDragOver({
  event,
  page,
  maxPage,
  pageChangeInterval,
  hoverInterval,
  setPage,
  clearHoverInterval,
}: HandleBinderDragOverArgs) {
  const targetID = event.operation.target?.id;

  const canGoLeft = targetID === "left" && page > 0;
  const canGoRight = targetID === "right" && page < maxPage;

  if (canGoLeft || canGoRight) {
    if (hoverInterval.current === null) {
      // Keep turning pages while a dragged card remains over a page detector.
      hoverInterval.current = window.setInterval(() => {
        setPage((prev) => {
          if (targetID === "left") return Math.max(prev - 1, 0);
          if (targetID === "right") return Math.min(prev + 1, maxPage);
          return prev;
        });
      }, pageChangeInterval);
    }
  } else {
    clearHoverInterval();
  }
}

export function handleBinderDragStart({
  event,
  setOverlayCard,
}: HandleBinderDragStartArgs) {
  setOverlayCard(event.operation.source?.data?.card || null);
}

export function handleBinderDragEnd({
  event,
  handleToBinder,
  handleToTableau,
  handleBinderMove,
  handleToTrash,
  clearHoverInterval,
  setOverlayCard,
}: HandleBinderDragEndArgs) {
  clearHoverInterval();
  setOverlayCard(null);
  if (event.canceled) return;

  const sourceType = String(event.operation.source?.type);
  const targetType = String(event.operation.target?.type);
  const sourceIndex = event.operation.source?.data?.index;
  const targetIndex = event.operation.target?.data?.index;

  if (
    sourceType === "tableau-draggable" &&
    targetType === "binder-droppable"
  ) {
    if (sourceIndex === undefined || targetIndex === undefined) return;
    handleToBinder(sourceIndex, targetIndex);
  } else if (
    sourceType === "binder-draggable" &&
    targetType === "tableau"
  ) {
    if (sourceIndex === undefined) return;
    handleToTableau(sourceIndex);
  } else if (
    sourceType === "binder-draggable" &&
    targetType === "binder-droppable"
  ) {
    if (sourceIndex === undefined || targetIndex === undefined) return;
    handleBinderMove(sourceIndex, targetIndex);
  } else if (targetType === "trash") {
    if (sourceIndex === undefined) return;
    handleToTrash(sourceType, sourceIndex);
  }

}
