import { Link } from "react-router-dom";
import SearchBar from "../features/search/components/SearchBar";
import type { CardInstance } from "../features/binder/state/binderTypes";
import Tableau from "../features/tableau/components/Tableau";
import { useRef, useState } from "react";
import Binder from "../features/binder/components/Binder";
import BinderFileControls from "../features/binder/components/BinderFileControls";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import CardOverlay from "../features/binder/components/CardOverlay";
import DragHoverDetector from "../features/binder/components/DragHoverDetector";
import CardOptionsModal from "../features/card-options/modal/components/CardOptionsModal";
import { useBinderManager } from "../features/binder/hooks/useBinderManager";
import {
  handleBinderDragEnd,
  handleBinderDragOver,
  handleBinderDragStart,
} from "../features/binder/utils/binderDragHandlers";
import styles from "./BinderCreate.module.css";
import {
  MAX_BINDER_PAGE_INDEX,
  PAGE_CHANGE_INTERVAL,
} from "../features/binder/config/binderConfig";

function BinderCreate() {
  const {
    tableauCards,
    binderCards,
    modalLocation,
    handleSelectCard,
    handleCardInteraction,
    handleCardSave,
    handleFlipCard,
    handleTrashCard,
    handleToBinder,
    handleToTableau,
    handleBinderMove,
    handleToTrash,
    closeModal,
    handleExport,
    handleImport,
    clearTableau,
  } = useBinderManager();

  const [overlayCard, setOverlayCard] = useState<CardInstance | null>(null);
  const [page, setPage] = useState(0);
  const hoverInterval = useRef<number | null>(null);

  const clearHoverInterval = () => {
    if (hoverInterval.current !== null) {
      clearInterval(hoverInterval.current);
      hoverInterval.current = null;
    }
  };

  const handlePageChange = (increment: number) => {
    setPage((prev) => Math.max(0, Math.min(prev + increment, MAX_BINDER_PAGE_INDEX)));
  };

  const selectedModalCard =
    modalLocation?.zone === "binder"
      ? binderCards[modalLocation.index]
      : modalLocation?.zone === "tableau"
        ? tableauCards[modalLocation.index]
        : null;

  return (
    <div className={styles.binderCreatePage}>
      <div className={styles.topArea}>
        <Link className={styles.homeLink} to="/">Home</Link>
        <SearchBar onSelectCard={handleSelectCard} />
      </div>

      <DragDropProvider
        onDragOver={(event) => {
          handleBinderDragOver({
            event,
            page,
            maxPage: MAX_BINDER_PAGE_INDEX,
            pageChangeInterval: PAGE_CHANGE_INTERVAL,
            hoverInterval,
            setPage,
            clearHoverInterval,
          });
        }}
        onDragStart={(event) => {
          handleBinderDragStart({ event, setOverlayCard });
        }}
        onDragEnd={(event) => {
          handleBinderDragEnd({
            event,
            handleToBinder,
            handleToTableau,
            handleBinderMove,
            handleToTrash,
            clearHoverInterval,
            setOverlayCard
          });
        }}
      >

        <Tableau
          onCardClick={handleCardInteraction}
          cards={tableauCards}
          onClearTableau={clearTableau}
        />

        <section className={styles.binderSection}>
          <div className={styles.binderLayout}>
            <DragHoverDetector id="left" />
            <Binder
              onCardClick={handleCardInteraction}
              onFlipCard={handleFlipCard}
              onTrashCard={handleTrashCard}
              footerStart={
                <BinderFileControls
                  onExport={handleExport}
                  onImport={handleImport}
                />
              }
              onPageChange={handlePageChange}
              page={page}
              cards={binderCards}
            />
            <DragHoverDetector id="right" />
          </div>
        </section>

        <DragOverlay dropAnimation={null}>
          {overlayCard ? <CardOverlay card={overlayCard} /> : null}
        </DragOverlay>
      </DragDropProvider>

      {modalLocation !== null && selectedModalCard !== null && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
           <CardOptionsModal
            card={selectedModalCard}
            handleSave={(card) => handleCardSave(card)}
            onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BinderCreate;
