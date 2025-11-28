import { z } from 'zod';

export const createLikeSchema = z.object({
	user_id: z.uuid('user_id debe ser un UUID válido'),
	post_id: z.uuid('post_id deber ser un UUID válido'),
});

export type CreateLikeInput = z.infer<typeof createLikeSchema>;

