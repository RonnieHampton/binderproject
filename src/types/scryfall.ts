export type ScryfallImageUris = {
  small?: string
  normal?: string
  large?: string
  png?: string
  art_crop?: string
  border_crop?: string
}

export type ScryfallCardFace = {
  name: string
  mana_cost?: string
  type_line?: string
  oracle_text?: string
  flavor_text?: string
  colors?: string[]
  image_uris?: ScryfallImageUris
}

export type ScryfallCard = {
  id: string
  oracle_id?: string
  name: string

  mana_cost?: string
  cmc?: number
  type_line?: string
  oracle_text?: string
  flavor_text?: string

  colors?: string[]
  color_identity?: string[]

  rarity?: string
  set?: string
  set_name?: string
  collector_number?: string
  released_at?: string

  image_uris?: ScryfallImageUris
  card_faces?: ScryfallCardFace[]

  prints_search_uri?: string

  layout: string
}

export type CardInstance = {
  card: ScryfallCard
  face: string
  id: string
}

export type ModalCard = {
  card: CardInstance | null
  index: number
  zone: string
}

export type ManaToken =
  | {
      type: "text";
      value: string;
    }
  | {
      type: "symbol";
      value: string;
};