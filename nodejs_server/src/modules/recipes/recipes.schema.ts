import { z } from "zod";

export const createRecipeSchema = z.object({
	id: z.string().uuid({ message: "Recipe ID must be a valid UUID from the Post ID" }),
	name: z.string().min(1, { message: "Recipe name is required" }),
	description: z.string().optional(),
	steps: z.string().optional(),
	difficulty: z.string().optional(),
	time_required: z.number().int().optional(),
	ingredients: z.array(z.object({
		ingredient_name: z.string(),
		unit: z.string(),
		quantity: z.number(),
	})).optional(),
});

export const updateRecipeSchema = z.object({
	name: z.string().min(1, { message: "Recipe name is required" }).optional(),
	description: z.string().optional(),
	steps: z.string().optional(),
	difficulty: z.string().optional(),
	time_required: z.number().int().optional(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
