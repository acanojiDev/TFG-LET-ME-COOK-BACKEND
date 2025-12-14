import { prisma } from "../../config/database";
import { CreatePlaceInput, UpdatePlaceInput } from "./places.schema";
import { Prisma } from "@prisma/client";

export class PlaceService {

    /**
     * Obtiene places con filtros y paginación por cursor
     * 
     * @param limit número de places a entregar
     * @param cursor ID del último place de la página anterior
     * @param filters filtros opcionales (minRating, maxDistance, type, openOnly, userLat, userLon)
     * @returns lista de places con información de paginación
     */
    static async getPlaces(
        limit: number,
        cursor?: string,
        filters?: {
            minRating?: number;
            maxDistance?: number;
            type?: 'bar' | 'restaurant';
            openOnly?: boolean;
            userLat?: number;
            userLon?: number;
        }
    ) {
        // Construir condiciones WHERE dinámicamente
        const whereConditions: Prisma.placesWhereInput = {
            // Filtro por tipo
            ...(filters?.type && { type: filters.type }),

            // Filtro por estado
            ...(filters?.openOnly !== false && { open: true }),

            // Filtro por rating
            ...(filters?.minRating !== undefined && {
                rating: {
                    gte: filters.minRating
                }
            }),
        };

        // Si hay filtro de distancia
        if (filters?.maxDistance && filters?.userLat !== undefined && filters?.userLon !== undefined) {
            ///TODO
        }

        // Query normal sin filtro de distancia
        return await prisma.places.findMany({
            take: limit + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor }
            }),
            where: whereConditions,
            orderBy: { id: 'asc' },
            select: {
                id: true,
                name: true,
                address: true,
                description: true,
                tags: true,
                rating: true,
                open: true,
                type: true,
            },
        });
    }

    static async getPlaceById(id: string) {
        return await prisma.places.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                address: true,
                description: true,
                tags: true,
                rating: true,
                open: true,
                type: true,
                place_reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        created_at: true,
                        users: {
                            select: {
                                id: true,
                                username: true,
                                photo_url: true,
                            }
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            },
        });
    }

    static async createPlace(data: CreatePlaceInput) {
        return prisma.places.create({
            data,
            select: {
                id: true,
                name: true,
                address: true,
                description: true,
                tags: true,
                rating: true,
                open: true,
                type: true,
            }
        });
    }

    static async updatePlace(id: string, data: UpdatePlaceInput) {
        return await prisma.places.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                address: true,
                description: true,
                tags: true,
                rating: true,
                open: true,
                type: true,
            },
        });
    }

    static async deletePlace(id: string) {
        return await prisma.places.delete({
            where: { id },
        });
    }

}