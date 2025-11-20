import { z } from 'zod';

export const createLikeSchema = z.object({
	userId: z.uuid('user_id debe ser un UUID válido'),
	postId: z.uuid('post_id deber ser un UUID válido'),
});

export type CreateLikeInput = z.infer<typeof createLikeSchema>;

