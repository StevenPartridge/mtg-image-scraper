export type ScryfallCard = {
    object: string;
    id: string;
    name: string;
    image_uris: {
        small: string;
        normal: string;
        large: string;
        png: string;
        art_crop: string;
        border_crop: string;
   }
}

export enum IMAGE_TYPES {
    SMALL = 'small',
    NORMAL = 'normal',
    LARGE = 'large',
    PNG = 'png',
    ART_CROP = 'art_crop',
    BORDER_CROP = 'border_crop'
}

export type ScryfallSearchResponse = {
    object: string;
    total_cards: number;
    has_more: boolean;
    next_page: string;
    data: ScryfallCard[];
}