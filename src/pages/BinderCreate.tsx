import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import type { CardInstance, ScryfallCard, ModalCard } from "../types/scryfall"
import Tableau from "../components/Tableau";
import { useRef, useState } from "react";
import Binder from "../components/Binder";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import TrashDroppable from "../components/Trash";
import CardOverlay from "../components/CardOverlay";
import DragHoverDetector from "../components/DragHoverDetector"
import type { TableauSortMode } from "../types/tableau";
import CardOptionsModal from "../components/CardOptionsModal";
import './BinderCreate.css'

function createCardInstance(card: ScryfallCard): CardInstance {
    return { 
        card,
        id: crypto.randomUUID(),
    };
}

function BinderCreate() {
	const [tableauCards, setTableauCards] = useState<(CardInstance | null)[]>([])
    const [binderCards, setBinderCards] = useState<(CardInstance | null)[]>(
        Array(60).fill(null)
    )
    const [overlayCard, setOverlayCard] = useState<CardInstance | null>(null);
    const [page, setPage] = useState(0);
    const hoverInterval = useRef<number | null>(null);
    const [sortMode, setSortMode] = useState<TableauSortMode>("cmc");
    const [modalCard, setModalCard] = useState<ModalCard | null>(null);

    const handleSelectSearch = (card: ScryfallCard) => {
        const newCard = createCardInstance(card);
        setTableauCards((prev) => [...prev, newCard])
    }

    const closeModal = () => {
        setModalCard(null);
    };

    const handleCardSave = (changedCard: ScryfallCard, index: number, zone: string) => {
        const card = createCardInstance(changedCard);
        if (zone === "binder") {
            setBinderCards((prev) => {
                const next = [...prev];
                next[index] = card;
                return next;
            });
        } else if (zone === "tableau") {
            setTableauCards((prev) => {
                const next = [...prev];
                next[index] = card;
                return next;
            });
        }
        closeModal();
    };

    const handleSelect = (card: CardInstance | null, index: number, zone: string) => {
        setModalCard({ card, index, zone });
    };

    const clearHoverInterval = () => {
            if (hoverInterval.current !== null) {
                clearInterval(hoverInterval.current);
                hoverInterval.current = null;
            }
        };

    const handlePageChange = (increment: number) => {
        setPage((prev) => Math.max(0, Math.min(prev + increment, 4)));
    };

    const handleToBinder = (sourceIndex: number, targetIndex: number) => {
        const neededCard = tableauCards[sourceIndex];
        if (!neededCard) return;

        const displacedCard = binderCards[targetIndex];

        setBinderCards((prevBinder) => {
            const nextBinder = [...prevBinder];
            nextBinder[targetIndex] = neededCard;
            return nextBinder;
        });

        setTableauCards((prevTableau) => {
            const nextTableau = prevTableau.filter((_, i) => i !== sourceIndex);

            if (displacedCard) {
                nextTableau.push(displacedCard);
            }

            return nextTableau;
        });
    };

    const handleToTableau = (sourceIndex: number) => {
    const neededCard = binderCards[sourceIndex];
    if (!neededCard) return;

    setBinderCards((prev) => {
        const next = [...prev];
        next[sourceIndex] = null;
        return next;
    });

    setTableauCards((prev) => [...prev, neededCard]);
    };

    const handleBinderMove = (sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;

        setBinderCards((prev) => {
            const next = [...prev];

            const neededCard = next[sourceIndex];
            if (!neededCard) return prev;

            const oldCard = next[targetIndex];

            next[sourceIndex] = oldCard ?? null;
            next[targetIndex] = neededCard;

            return next;
        });
    };

    const handleToTrash = (
    sourceType: string | undefined,
    sourceIndex: number
    ) => {
    if (sourceType === "binder-draggable") {
        setBinderCards((prev) => {
        const next = [...prev];
        next[sourceIndex] = null;
        return next;
        });

        return;
    }

    if (sourceType === "tableau-draggable") {
        setTableauCards((prev) =>
        prev.filter((_, i) => i !== sourceIndex)
        );
    }
    };

	return (
		<div>
            <div className="topArea">
			<Link to="/">Home</Link>
			<SearchBar onSelectCard={handleSelectSearch} />
            </div>

            <DragDropProvider 
            onDragOver={(event) => {
                const targetID = event.operation.target?.id;

                const canGoLeft = targetID === "left" && page > 0;
                const canGoRight = targetID === "right" && page < 4;

                if (canGoLeft || canGoRight) {
                    if (hoverInterval.current === null) {
                    hoverInterval.current = window.setInterval(() => {
                        setPage((prev) => {
                        if (targetID === "left") return Math.max(prev - 1, 0);
                        if (targetID === "right") return Math.min(prev + 1, 4);
                        return prev;
                        });
                    }, 500);
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
                    if (sourceType === 'tableau-draggable' && targetType === 'binder-droppable') {
                        handleToBinder(sourceIndex, targetIndex);
                        console.log(`Card dragged from tableau to binder at index: ${targetIndex}`);
                    } else if (sourceType === 'binder-draggable' && targetType === 'tableau') {
                        handleToTableau(sourceIndex);
                        console.log(`Card dragged from binder to tableau from index: ${sourceIndex}`);
                    } else if (sourceType === 'binder-draggable' && targetType === 'binder-droppable') {
                        handleBinderMove(sourceIndex, targetIndex);
                        // Handle the case where a card is dragged from the binder to the binder
                        console.log(`Card dragged from binder index ${sourceIndex} to binder at index: ${targetIndex}`);
                    } else if (targetType === 'trash') {
                        handleToTrash(sourceType, sourceIndex);
                        console.log(`Card dragged to trash from index: ${sourceIndex}`);
                    }

                    clearHoverInterval();
                }
            }>
                <TrashDroppable />
                <select
                    value={sortMode}
                    onChange={(e) =>
                        setSortMode(e.target.value as TableauSortMode)
                    }
                >
                    <option value="cmc">Mana Value</option>
                    <option value="color_identity">Color Identity</option>
                    <option value="type_line">Type</option>
                    <option value="rarity">Rarity</option>
                    <option value="set">Set</option>
                </select>
                <Tableau onSelect={handleSelect} sortType={sortMode} cards={tableauCards}/>
                <p>{`Current page: ${page + 1}/5`}</p>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "250px auto 250px",
                    columnGap: "24px",
                    alignItems: "start",
                    justifyContent: "center",
                }}>
                <DragHoverDetector id="left" />
                <Binder onSelect={handleSelect} onPageChange={handlePageChange} page={page} cards={binderCards}/>
                <DragHoverDetector id="right" />
                </div>

                <DragOverlay dropAnimation={null}>
                    {overlayCard ? (
                    <CardOverlay card={overlayCard} />
                    ) : null}
                </DragOverlay>

            </DragDropProvider>

            {modalCard !== null && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                    <CardOptionsModal
                        card={modalCard.card}
                        index={modalCard.index}
                        zone={modalCard.zone}
                        handleSave={(card, index, zone) => handleCardSave(card, index, zone)}
                    />
                    </div>
                </div>
                )}
		</div>
	)
}

export default BinderCreate