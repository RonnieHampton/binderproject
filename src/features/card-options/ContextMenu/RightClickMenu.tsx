import { useRef, useState } from "react";
import type { CardInstance, CardLocation, CardZone } from "../../../binder/state/binderTypes";
import { hasDistinctCardFaces } from "../../cards/utils/cardFaceUtils";
import useCardPrintings from "../hooks/useCardPrintings";
import getClampedFixedPosition from "./getClampedFixedPosition";
import RightClickPrintingSubmenu from "./RightClickPrintingSubmenu";
import styles from "./RightClickMenu.module.css";

type RightClickMenuProps = {
  instance: CardInstance;
  location: CardLocation;
  x: number;
  y: number;
  onDetailsClick: (location: CardLocation) => void;
  onFlipCard: (location: CardLocation) => void;
  onUpdateCardAtLocation: (card: CardInstance, location: CardLocation) => void;
  onTrashCard: (location: CardLocation) => void;
  onMoveCardToZone: (source: CardLocation, targetZone: CardZone) => void;
  onDuplicateCard: (location: CardLocation) => void;
  onClose: () => void;
};

function RightClickMenu({
  instance,
  location,
  x,
  y,
  onDetailsClick,
  onFlipCard,
  onUpdateCardAtLocation,
  onTrashCard,
  onMoveCardToZone,
  onClose,
  onDuplicateCard,
}: RightClickMenuProps) {
  const [showPrintingSubmenu, setShowPrintingSubmenu] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const submenuAreaRef = useRef<HTMLDivElement | null>(null);
  const targetZone = location.zone === "binder" ? "tableau" : "binder";
  const canFlip = hasDistinctCardFaces(instance.card);
  const { printings, status, errorMessage } = useCardPrintings(
    instance.card.prints_search_uri
  );
  const hasAlternatePrintings = printings.length > 0;
  const menuWidth = 220;
  const menuHeight = 260;
  const submenuWidth = 416;
  const submenuHeight = 370;
  const menuPosition = getClampedFixedPosition({
    x,
    y,
    width: menuWidth,
    height: menuHeight,
  });

  const handleDetailsClick = () => {
    onDetailsClick(location);
    onClose();
  };

  const handleFlipClick = () => {
    onFlipCard(location);
    onClose();
  };

  const handlePrintingChange = (printing: CardInstance) => {
    onUpdateCardAtLocation(printing, location);
    onClose();
  };

  const handleTrashClick = () => {
    onTrashCard(location);
    onClose();
  };

  const handleMoveCardToZone = (source: CardLocation, targetZone: CardZone) => {
    onMoveCardToZone(source, targetZone);
    onClose();
  };

  const handleDuplicateCard = (location: CardLocation) => {
    onDuplicateCard(location);
    onClose();
  };

  const openPrintingSubmenu = () => {
    const triggerRect = submenuAreaRef.current?.getBoundingClientRect();
    if (!triggerRect) {
      setShowPrintingSubmenu(true);
      return;
    }

    const gap = 6;
    const opensRight = triggerRect.right + gap + submenuWidth <= window.innerWidth;
    const baseX = opensRight
      ? triggerRect.right + gap
      : triggerRect.left - submenuWidth - gap;
    const baseY = triggerRect.top - 6;
    setSubmenuPosition(
      getClampedFixedPosition({
        x: baseX,
        y: baseY,
        width: submenuWidth,
        height: submenuHeight,
      })
    );
    setShowPrintingSubmenu(true);
  };

  return (
    <div
      className={styles.contextMenu}
      onClick={(event) => event.stopPropagation()}
      style={{ left: menuPosition.x, position: "fixed", top: menuPosition.y }}
    >
      <button className={styles.menuItem} onClick={handleDetailsClick} type="button">Details</button>
      {canFlip && (
        <button className={styles.menuItem} onClick={handleFlipClick} type="button">Flip Card</button>
      )}
      <button className={styles.menuItem} onClick={() => handleMoveCardToZone(location, targetZone)} type="button">Move to {targetZone}</button>
      {hasAlternatePrintings && (
        <div
          ref={submenuAreaRef}
          className={styles.submenuArea}
          onMouseEnter={openPrintingSubmenu}
          onMouseLeave={() => setShowPrintingSubmenu(false)}
        >
          <button className={styles.submenuTrigger} type="button">
            <span>Change printing</span>
            <span className={styles.submenuArrow} aria-hidden="true">›</span>
          </button>

          {showPrintingSubmenu && (
            <RightClickPrintingSubmenu
              instance={instance}
              printings={printings}
              status={status}
              errorMessage={errorMessage}
              x={submenuPosition.x}
              y={submenuPosition.y}
              onPrintingClick={handlePrintingChange}
            />
          )}
        </div>
      )}
      <button className={styles.menuItem} onClick={() => handleDuplicateCard(location)} type="button">Duplicate</button>
      <button className={`${styles.menuItem} ${styles.dangerItem}`} onClick={handleTrashClick} type="button">Delete</button>
    </div>
  );
}

export default RightClickMenu;
