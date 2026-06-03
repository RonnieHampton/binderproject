import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CardFace } from "../../binder/state/binderTypes";

type CardFlipAnimationProps = {
  children: (displayFace: CardFace) => ReactNode;
  face: CardFace;
};

const FLIP_ANIMATION_DURATION = 350;
const FLIP_FACE_SWAP_DELAY = FLIP_ANIMATION_DURATION / 2;

function CardFlipAnimation({ children, face }: CardFlipAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const previousFace = useRef<CardFace>(face);
  const [displayFace, setDisplayFace] = useState<CardFace>(face);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (previousFace.current !== face) {
      element.classList.remove("cardFlipAnimation");

      // Force the browser to notice the class was removed before re-adding it.
      void element.offsetWidth;

      element.classList.add("cardFlipAnimation");
      previousFace.current = face;

      const swapFaceTimeout = window.setTimeout(() => {
        setDisplayFace(face);
      }, FLIP_FACE_SWAP_DELAY);

      const clearAnimationTimeout = window.setTimeout(() => {
        element.classList.remove("cardFlipAnimation");
      }, FLIP_ANIMATION_DURATION);

      return () => {
        window.clearTimeout(swapFaceTimeout);
        window.clearTimeout(clearAnimationTimeout);
      };
    }
  }, [face]);

  return <div ref={elementRef}>{children(displayFace)}</div>;
}

export default CardFlipAnimation;
