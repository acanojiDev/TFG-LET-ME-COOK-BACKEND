import { Request, Response } from "express";
import { createPlaceSchema, updatePlaceSchema, getPlacesQuerySchema } from "./places.schema";
import { PlaceService } from "./places.service";

export class PlaceController {

    static async getPlaces(req: Request, res: Response) {
        try {
            const queryParams = getPlacesQuerySchema.parse(req.query);

            const { limit, cursor, minRating, maxDistance, type, openOnly, userLat, userLon } = queryParams;

            if (maxDistance && (userLat === undefined || userLon === undefined)) {
                return res.status(400).json({
                    error: 'Para filtrar por distancia, debes proporcionar userLat y userLon'
                });
            }

            const allPlaces = await PlaceService.getPlaces(
                limit,
                cursor,
                {
                    minRating,
                    maxDistance,
                    type,
                    openOnly,
                    userLat,
                    userLon
                }
            );

            const hasMore = allPlaces.length > limit;
            /// Me deshago de la última en el caso de que me traiga mas del límite
            const places = hasMore ? allPlaces.slice(0, limit) : allPlaces;

            const nextCursor = places.length > 0 ? places[places.length - 1].id : null;

            res.status(200).json({
                data: places,
                next_cursor: nextCursor,
                has_more: hasMore
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getPlaceById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const place = await PlaceService.getPlaceById(id);

            if (!place) {
                return res.status(404).json({ error: 'Lugar no encontrado' });
            }

            res.status(200).json({ data: place });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createPlace(req: Request, res: Response) {
        try {
            const validatedData = createPlaceSchema.parse(req.body);
            const place = await PlaceService.createPlace(validatedData);

            res.status(201).json({
                message: 'Lugar creado exitosamente',
                data: place,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async updatePlace(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validatedData = updatePlaceSchema.parse(req.body);
            const place = await PlaceService.updatePlace(id, validatedData);

            res.status(200).json({
                message: 'Lugar actualizado exitosamente',
                data: place,
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deletePlace(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await PlaceService.deletePlace(id);

            res.status(200).json({ message: 'Lugar eliminado exitosamente' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}