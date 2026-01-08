export declare class PlaceService {
    /**
     * Obtener un place por ID con toda su información
     * Incluye: nombre, ubicación (address), tipo, tags, rating, likes, comentarios, reservas
     */
    static getPlaceById(id: string): Promise<{
        likesCount: number;
        commentsCount: number;
        reservationsCount: number;
        place_reviews: {
            id: string;
        }[];
        _count: {
            place_reviews: number;
        };
        type: string | null;
        name: string;
        id: string;
        media_url: string;
        description: string | null;
        address: string;
        tags: string[];
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        open: boolean | null;
    } | null>;
    /**
     * Obtener todos los places
     */
    static getAllPlaces(): Promise<({
        place_reviews: {
            id: string;
        }[];
        _count: {
            place_reviews: number;
        };
    } & {
        type: string | null;
        name: string;
        id: string;
        media_url: string;
        description: string | null;
        address: string;
        tags: string[];
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        open: boolean | null;
    })[]>;
}
//# sourceMappingURL=place.service.d.ts.map