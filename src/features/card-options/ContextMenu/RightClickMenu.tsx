import { useState } from "react";
import type { CardInstance, CardLocation, CardZone } from "../../../binder/state/binderTypes";
import { hasDistinctCardFaces } from "../../cards/utils/cardFaceUtils";
import useCardPrintings from "../hooks/useCardPrintings";
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
    const targetZone = location.zone === "binder" ? "tableau" : "binder";
    const canFlip = hasDistinctCardFaces(instance.card);
    const { printings, status, errorMessage } = useCardPrintings(
        instance.card.prints_search_uri
    );
    const hasAlternatePrintings = printings.length > 0;
    const menuWidth = 220;
    const menuHeight = 260;
    const viewportMargin = 8;
    const clampedX = Math.max(
        viewportMargin,
        Math.min(x, window.innerWidth - menuWidth - viewportMargin)
    );
    const clampedY = Math.max(
        viewportMargin,
        Math.min(y, window.innerHeight - menuHeight - viewportMargin)
    );

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
    }

    const handleDuplicateCard = (location: CardLocation) => {
        onDuplicateCard(location);
        onClose();
    }



    return (
        <div
            className={styles.contextMenu}
            onClick={(event) => event.stopPropagation()}
            style={{ left: clampedX, position: "fixed", top: clampedY }}
        >
            <button className={styles.menuItem} onClick={handleDetailsClick} type="button">Details</button>
            {canFlip && (
                <button className={styles.menuItem} onClick={handleFlipClick} type="button">Flip Card</button>
            )}
            <button className={styles.menuItem} onClick={() => handleMoveCardToZone(location, targetZone)} type="button">Move to {targetZone}</button>
            {hasAlternatePrintings && (
                <div
                    className={styles.submenuArea}
                    onMouseEnter={() => setShowPrintingSubmenu(true)}
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
                            onPrintingClick={handlePrintingChange}
                        />
                    )}
                </div>
            )}
            <button className={styles.menuItem} onClick={() => handleDuplicateCard(location)}type="button">Duplicate</button>
            <button className={`${styles.menuItem} ${styles.dangerItem}`} onClick={handleTrashClick} type="button">Delete</button>
        </div>
    );
}

export default RightClickMenu;
