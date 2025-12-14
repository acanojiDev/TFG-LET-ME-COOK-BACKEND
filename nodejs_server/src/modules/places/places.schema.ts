import { z } from 'zod'

export const createPlaceSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    address: z.string().min(1, "La dirección es requerida"),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    rating: z.number().min(0).max(5).optional(),
    open: z.boolean().default(true),
    type: z.enum(['bar', 'restaurant'], {
        message: "El tipo debe ser 'bar' o 'restaurant'"
    }),
});

export const updatePlaceSchema = z.object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    rating: z.number().min(0).max(5).optional(),
    open: z.boolean().optional(),
    type: z.enum(['bar', 'restaurant']).optional(),
}).partial();

export const getPlacesQuerySchema = z.object({
    limit: z.string().optional().transform((val) => {
        if (!val) return 5;
        const parsed = parseInt(val);
        return Math.min(Math.max(parsed, 1), 15);
    }),
    cursor: z.string().uuid().optional(),
    minRating: z.string().optional().transform((val) => {
        if (!val) return undefined;
        const parsed = parseFloat(val);
        return parsed >= 0 && parsed <= 5 ? parsed : undefined;
    }),
    maxDistance: z.string().optional().transform((val) => {
        if (!val) return undefined;
        const parsed = parseFloat(val);
        return parsed > 0 ? parsed : undefined;
    }),
    type: z.enum(['bar', 'restaurant']).optional(),
    openOnly: z.string().optional().transform((val) => {
        if (val === undefined || val === null || val === '') return true;
        return val === 'true';
    }),
    userLat: z.string().optional().transform((val) => {
        if (!val) return undefined;
        const parsed = parseFloat(val);
        return !isNaN(parsed) ? parsed : undefined;
    }),
    userLon: z.string().optional().transform((val) => {
        if (!val) return undefined;
        const parsed = parseFloat(val);
        return !isNaN(parsed) ? parsed : undefined;
    }),
});

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof updatePlaceSchema>;
export type GetPlacesQuery = z.infer<typeof getPlacesQuerySchema>;