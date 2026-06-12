import { Link } from "react-router-dom";
import SearchBar from "../features/search/components/SearchBar";
import type { CardInstance, CardLocation } from "../binder/state/binderTypes";
import Tableau from "../binder/tableau/components/Tableau";
import { useRef, useState } from "react";
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
import { useBinderKeyboardShortcuts } from "../binder/hooks/useBinderKeyboardShortcuts.ts";
import { useBinderSelectionTarget } from "../binder/hooks/useBinderSelectionTarget";
import { useBinderContextMenu } from "../binder/hooks/useBinderContextMenu";
import { useConfirmedCardDelete } from "../binder/hooks/useConfirmedCardDelete";
import { useEscapeToClose } from "../binder/hooks/useEscapeToClose";

function BinderCreate() {

  const [settings, setSettings] = useState<BinderSettings>({
    keyboardShortcuts: true,
    keyboardOnlyMode: false,
    confirmBeforeDelete: false,
    showHoverControls: true,
    clickCompatibilityMode: false,
    showCardTooltips: true,
    showEmptySlotNumbers: false,
  });

  const dragAndDropEnabled =
    !settings.keyboardOnlyMode && !settings.clickCompatibilityMode;

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

  const [overlayCard, setOverlayCard] = useState<CardInstance | null>(null);
  const [page, setPage] = useState(0);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const hoverInterval = useRef<number | null>(null);


  const {
    selectedCard,
    setSelectedCard,
    handleCardHoverStart,
    handleCardHoverEnd,
  } = useBinderSelectionTarget(settings);

  const handleCardClick = (
    location: CardLocation,
    event: React.MouseEvent
  ) => {
    if (settings.clickCompatibilityMode) {
      setSelectedCard(location);
      return;
    }

    handleCardInteraction(location, event);
  };

  const handleBinderSlotClick = (location: CardLocation) => {
    if (!settings.clickCompatibilityMode) return;

    setSelectedCard(location);
  };

  const {
    contextMenu,
    contextMenuCard,
    handleCardContextMenu,
    closeContextMenu,
  } = useBinderContextMenu({ binderCards, tableauCards });

  const {
    handleConfirmedTrashCard,
    handleConfirmedDraggedCardTrash,
  } = useConfirmedCardDelete({
    confirmBeforeDelete: settings.confirmBeforeDelete,
    onTrashCard: handleTrashCard,
    onTrashDraggedCard: handleToTrash,
  });

  useBinderKeyboardShortcuts({
    enabled: settings.keyboardShortcuts,
    selectedCard,
    confirmBeforeDelete: settings.confirmBeforeDelete,
    onFlipCard: handleFlipCard,
    onDuplicateCard: handleDuplicateCard,
    onTrashCard: handleTrashCard,
    onMoveCardToZone: handleMoveCardToZone,
    onOpenDetails: openModal,
  });

  useEscapeToClose(modalLocation !== null, closeModal);

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

  return (
    <div className={styles.binderCreatePage}>
      <div className={styles.topArea}>
        <Link className={styles.homeLink} to="/">Home</Link>
        <SearchBar onSelectCard={handleSelectCard} />
      </div>

      <DragDropProvider
        onDragOver={(event) => {
          if (!dragAndDropEnabled) return;

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
          if (!dragAndDropEnabled) return;

          handleBinderDragStart({ event, setOverlayCard });
        }}
        onDragEnd={(event) => {
          if (!dragAndDropEnabled) return;

          handleBinderDragEnd({
            event,
            handleToBinder,
            handleToTableau,
            handleBinderMove,
            handleToTrash: handleConfirmedDraggedCardTrash,
            clearHoverInterval,
            setOverlayCard
          });
        }}
      >

        <Tableau
          onCardClick={handleCardClick}
          onCardContextMenu={handleCardContextMenu}
          cards={tableauCards}
          onClearTableau={clearTableau}
          onMouseEnter={handleCardHoverStart}
          onMouseLeave={handleCardHoverEnd}
          selectedCard={selectedCard}
          settings={settings}
          dragAndDropEnabled={dragAndDropEnabled}
        />

        <section className={styles.binderSection}>
          <div className={styles.binderLayout}>
            <DragHoverDetector id="left" enabled={dragAndDropEnabled} />
            <Binder
              onCardClick={handleCardClick}
              onSlotClick={handleBinderSlotClick}
              onCardContextMenu={handleCardContextMenu}
              onFlipCard={handleFlipCard}
              onTrashCard={handleConfirmedTrashCard}
              footerStart={
                <BinderFileControls
                  onExport={handleExport}
                  onImport={handleImport}
                />
              }
              onMouseEnter={handleCardHoverStart}
              onMouseLeave={handleCardHoverEnd}
              onPageChange={handlePageChange}
              page={page}
              cards={binderCards}
              selectedCard={selectedCard}
              settings={settings}
              dragAndDropEnabled={dragAndDropEnabled}
            />
            <DragHoverDetector id="right" enabled={dragAndDropEnabled} />
          </div>
        </section>

        {dragAndDropEnabled && <DragOverlay dropAnimation={null}>
          {overlayCard ? <CardOverlay card={overlayCard} /> : null}
        </DragOverlay>}
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
        onTrashCard={handleConfirmedTrashCard}
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
