import { Link } from "react-router-dom";
import SearchBar from "../features/search/components/SearchBar";
import type { CardInstance, CardLocation } from "../binder/state/binderTypes";
import Tableau from "../binder/tableau/components/Tableau";
import { useEffect, useRef, useState } from "react";
import Binder from "../binder/components/Binder";
import BinderFileControls from "../binder/components/BinderFileControls";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import CardOverlay from "../binder/components/CardOverlay";
import DragHoverDetector from "../binder/components/DragHoverDetector";
import CardOptionsModal from "../features/card-options/modal/components/CardOptionsModal";
import { useBinderManager } from "../binder/hooks/useBinderManager";
import {
  handleBinderDragEnd,
  handleBinderDragOver,
  handleBinderDragStart,
} from "../binder/utils/binderDragHandlers";
import styles from "./BinderCreate.module.css";
import {
  MAX_BINDER_PAGE_INDEX,
  PAGE_CHANGE_INTERVAL,
} from "../binder/config/binderConfig";
import RightClickMenu from "../features/card-options/ContextMenu/RightClickMenu";
import BinderSidePanel from "../binder/components/BinderSidePanel";
import type { BinderSettings } from "../binder/types/binderSettings";

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
    openModal,
    handleExport,
    handleImport,
    clearTableau,
    handleUpdateCardAtLocation,
    handleMoveCardToZone,
    handleDuplicateCard,
  } = useBinderManager();


  const [contextMenu, setContextMenu] = useState<{
    location: CardLocation;
    x: number;
    y: number;
  } | null>(null);
  const [overlayCard, setOverlayCard] = useState<CardInstance | null>(null);
  const [page, setPage] = useState(0);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const hoverInterval = useRef<number | null>(null);
  const [settings, setSettings] = useState<BinderSettings>({
    keyboardShortcuts: true,
    confirmBeforeDelete: true,
    showHoverControls: true,
    clickCompatibilityMode: false,
    compactTableau: false,
    showCardTooltips: true,
    showEmptySlotNumbers: true,
  });

  const updateSetting = <K extends keyof BinderSettings>(
  key: K,
  value: BinderSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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

  const contextMenuCard =
    contextMenu?.location.zone === "binder"
      ? binderCards[contextMenu.location.index]
      : contextMenu?.location.zone === "tableau"
        ? tableauCards[contextMenu.location.index]
        : null;

  const handleCardContextMenu = (
    location: CardLocation,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      location,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    if (!contextMenu) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeContextMenu();
      }
    };

    document.addEventListener("click", closeContextMenu);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", closeContextMenu);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [contextMenu]);

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
          onCardContextMenu={handleCardContextMenu}
          cards={tableauCards}
          onClearTableau={clearTableau}
        />

        <section className={styles.binderSection}>
          <div className={styles.binderLayout}>
            <DragHoverDetector id="left" />
            <Binder
              onCardClick={handleCardInteraction}
              onCardContextMenu={handleCardContextMenu}
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

      {contextMenu && contextMenuCard && <RightClickMenu
        instance={contextMenuCard}
        location={contextMenu.location}
        x={contextMenu.x}
        y={contextMenu.y}
        onUpdateCardAtLocation={handleUpdateCardAtLocation}
        onDetailsClick={openModal}
        onFlipCard={handleFlipCard}
        onTrashCard={handleTrashCard}
        onClose={closeContextMenu}
        onMoveCardToZone={handleMoveCardToZone}
        onDuplicateCard={handleDuplicateCard}
      />}

      <BinderSidePanel 
        sidePanelOpen={sidePanelOpen} 
        setSidePanelOpen={setSidePanelOpen} 
        settings={settings}
        updateSetting={updateSetting}
      />

    </div>
  );
}

export default BinderCreate;
