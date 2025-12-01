import { z } from 'zod'

export const createPlaceSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    address: z.string(),
    description: z.string().optional(),
    tags: z.string().optional(),
    geolocation: [z.number().optional(), z.number().optional()],
    rating: z.number().optional(),
    open: z.boolean(),
    type: z.string(),
});

export const updatePlaceSchema = z.object({
    name: z.string(),
    address: z.string(),
    description: z.string().optional(),
    tags: z.string().optional(),
    geolocation: [z.number().optional(), z.number().optional()],
    rating: z.number().optional(),
    open: z.boolean(),
    type: z.string(),
});

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof updatePlaceSchema>;