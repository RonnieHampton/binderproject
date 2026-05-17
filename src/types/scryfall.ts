export type ScryfallCardFace = {
  name: string

  image_uris?: {
    small?: string
    normal?: string
  }
}

export type ScryfallCard = {
  id: string
  name: string
  image_uris?: {
    small?: string
    normal?: string
  }
  set?: string
  collector_number?: string
  card_faces?: ScryfallCardFace[]
}

export type ScryfallSearchResponse = {
  data: ScryfallCard[]
}