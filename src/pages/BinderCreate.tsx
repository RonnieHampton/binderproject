import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import type { CardInstance, ScryfallCard } from "../types/scryfall"
import Tableau from "../components/Tableau";
import { useState } from "react";
import Binder from "../components/Binder";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import TrashDroppable from "../components/Trash";
import CardOverlay from "../components/CardOverlay";

function createCardInstance(card: ScryfallCard): CardInstance {
    return { 
        card,
        id: crypto.randomUUID(),
    };
}

function BinderCreate() {
	const [tableauCards, setTableauCards] = useState<CardInstance[]>([])
    const [binderCards, setBinderCards] = useState<(CardInstance | null)[]>(
        Array(60).fill(null)
    )
    const [overlayCard, setOverlayCard] = useState<CardInstance | null>(null);

    const handleSelectCard = (card: ScryfallCard) => {
        const newCard = createCardInstance(card);
        setTableauCards((prev) => [...prev, newCard])
    }
    
    const handleToBinder = (sourceIndex: number, targetIndex: number) => {
        const neededCard = tableauCards[sourceIndex]
        if (!neededCard) return;
        setTableauCards((prev) => prev.filter((_, i) => i !== sourceIndex));
        const nextBinder = [...binderCards];
        nextBinder[targetIndex] = neededCard;
        setBinderCards(nextBinder);
    }

    const handleToTableau = (sourceIndex: number) => {
        const neededCard = binderCards[sourceIndex];
        if (!neededCard) return;
        setBinderCards((prev) => prev.filter((_, i) => i !== sourceIndex));
        setTableauCards((prev) => [...prev, neededCard]);
    }

    const handleBinderMove = (sourceIndex: number, targetIndex: number) => {
        const oldCard = binderCards[targetIndex];
        const neededCard = binderCards[sourceIndex];
        if (!neededCard) return;
        const nextBinder = [...binderCards];
        nextBinder[sourceIndex] = oldCard ?? null;
        nextBinder[targetIndex] = neededCard;
        setBinderCards(nextBinder);
    }

    const handleToTrash = (sourceType: string | undefined,sourceIndex: number) => {
        if (sourceType === "binder-draggable") {
            setBinderCards((prev) => {
            const next = [...prev];
            next[sourceIndex] = null;
            return next;
            });
        } else {
            setTableauCards((prev) =>
            prev.filter((_, i) => i !== sourceIndex)
            );
        }
    };

	return (
		<div>
            <div className="topArea">
			<Link to="/">Home</Link>
			<SearchBar onSelectCard={handleSelectCard} />
            </div>

            <DragDropProvider onDragStart={(event) => { 
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
                        console.log(`Card dragged from binder to tableau at index: ${sourceIndex}`);
                    } else if (sourceType === 'binder-draggable' && targetType === 'binder-droppable') {
                        handleBinderMove(sourceIndex, targetIndex);
                        // Handle the case where a card is dragged from the binder to the binder
                        console.log(`Card dragged from binder to binder at index: ${targetIndex}`);
                    } else if (targetType === 'trash') {
                        handleToTrash(sourceType, sourceIndex);
                        console.log(`Card dragged to trash at index: ${sourceIndex}`);
                    }
                }
            }>
                <TrashDroppable />
                <Tableau cards={tableauCards}/>
                <Binder cards={binderCards}/>

                <DragOverlay dropAnimation={null}>
                    {overlayCard ? (
                    <CardOverlay card={overlayCard} />
                    ) : null}
                </DragOverlay>

            </DragDropProvider>
		</div>
	)
}

export default BinderCreate