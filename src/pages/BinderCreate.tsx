import { Link } from "react-router-dom";
import SearchBar from "../features/search/components/SearchBar";
import type { CardInstance } from "../features/binder/state/binderTypes";
import Tableau from "../features/tableau/components/Tableau";
import { useRef, useState } from "react";
import Binder from "../features/binder/components/Binder";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import TrashDroppable from "../features/binder/components/Trash";
import CardOverlay from "../features/binder/components/CardOverlay";
import DragHoverDetector from "../features/binder/components/DragHoverDetector";
import type { TableauSortMode } from "../features/tableau/types/tableau";
import CardOptionsModal from "../features/cards/components/CardOptionsModal";
import { useBinderManager } from "../features/binder/hooks/useBinderManager";
import styles from "./BinderCreate.module.css";

const MAX_PAGE = 4;
const PAGE_CHANGE_INTERVAL = 500;

function BinderCreate() {
  const {
    tableauCards,
    binderCards,
    modalCard,
    handleSelectCard,
    handleModalSelect,
    handleCardSave,
    handleToBinder,
    handleToTableau,
    handleBinderMove,
    handleToTrash,
    closeModal,
    handleExport,
    handleImport,
    handleCtrlClick
  } = useBinderManager();

  const [overlayCard, setOverlayCard] = useState<CardInstance | null>(null);
  const [page, setPage] = useState(0);
  const hoverInterval = useRef<number | null>(null);
  const [sortMode, setSortMode] = useState<TableauSortMode>("cmc");

  const clearHoverInterval = () => {
    if (hoverInterval.current !== null) {
      clearInterval(hoverInterval.current);
      hoverInterval.current = null;
    }
  };

  const handlePageChange = (increment: number) => {
    setPage((prev) => Math.max(0, Math.min(prev + increment, MAX_PAGE)));
  };

  return (
    <div className={styles.binderCreatePage}>
      <div className={styles.topArea}>
        <Link to="/">Home</Link>
        <SearchBar onSelectCard={handleSelectCard} />
      </div>

      <DragDropProvider
        onDragOver={(event) => {
          const targetID = event.operation.target?.id;

          const canGoLeft = targetID === "left" && page > 0;
          const canGoRight = targetID === "right" && page < MAX_PAGE;

          if (canGoLeft || canGoRight) {
            if (hoverInterval.current === null) {
              hoverInterval.current = window.setInterval(() => {
                setPage((prev) => {
                  if (targetID === "left") return Math.max(prev - 1, 0);
                  if (targetID === "right") return Math.min(prev + 1, MAX_PAGE);
                  return prev;
                });
              }, PAGE_CHANGE_INTERVAL);
            }
          } else {
            clearHoverInterval();
          }
        }}
        onDragStart={(event) => {
          setOverlayCard(event.operation.source?.data?.card || null);
        }}
        onDragEnd={(event) => {
          if (event.canceled) return;

          const sourceType = String(event.operation.source?.type);
          const targetType = String(event.operation.target?.type);
          const sourceIndex = event.operation.source?.data?.index;
          const targetIndex = event.operation.target?.data?.index;

          if (
            sourceType === "tableau-draggable" &&
            targetType === "binder-droppable"
          ) {
            handleToBinder(sourceIndex, targetIndex);
          } else if (
            sourceType === "binder-draggable" &&
            targetType === "tableau"
          ) {
            handleToTableau(sourceIndex);
          } else if (
            sourceType === "binder-draggable" &&
            targetType === "binder-droppable"
          ) {
            handleBinderMove(sourceIndex, targetIndex);
          } else if (targetType === "trash") {
            handleToTrash(sourceType, sourceIndex);
          }

          clearHoverInterval();
        }}
      >
        <TrashDroppable />

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

        <Tableau
          onCtrlClick={(card, index) => handleCtrlClick(card, index, "tableau")}
          onSelect={handleModalSelect}
          sortType={sortMode}
          cards={tableauCards}
        />

        <p className={styles.pageIndicator}>{`Current page: ${page + 1}/${MAX_PAGE + 1}`}</p>

        <div className={styles.binderLayout}>
          <DragHoverDetector id="left" />
          <Binder
            onCtrlClick={(card, index, zone) => handleCtrlClick(card, index, zone)}
            onSelect={handleModalSelect}
            onPageChange={handlePageChange}
            page={page}
            cards={binderCards}
          />
          <DragHoverDetector id="right" />
        </div>

        <DragOverlay dropAnimation={null}>
          {overlayCard ? <CardOverlay card={overlayCard} /> : null}
        </DragOverlay>
      </DragDropProvider>

      {modalCard !== null && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
           <CardOptionsModal
            card={modalCard.card}
            index={modalCard.index}
            zone={modalCard.zone}
            handleSave={(card, index, zone, face) => handleCardSave(card, index, zone, face)}
            />
          </div>
        </div>
      )}
      <button className={styles.exportButton} onClick={handleExport}>Export Binder</button>

      <input
        className={styles.importInput}
        type="file"
        accept="application/json,.json"
        onChange={handleImport}
        />
    </div>
  );
}

export default BinderCreate;
