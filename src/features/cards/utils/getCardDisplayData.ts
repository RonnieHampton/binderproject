import type { CardInstance } from "../../../binder/state/binderTypes";
import type { CardDisplayData} from "../types/cardTypes";

function getCardDisplayData(instance: CardInstance): CardDisplayData {
    const cardData = {
        name: instance.card.name,
        default: instance.card.image_uris,
        front: instance.card.card_faces?.[0]?.image_uris,
        back: instance.card.card_faces?.[1]?.image_uris
    }

    return cardData;
}

export default getCardDisplayData;
