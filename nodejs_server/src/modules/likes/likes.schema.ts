import { z } from 'zod';

export const createLikeSchema = z.object({
	user_id: z.uuid('user not found'),
	post_id: z.uuid('post not found'),
});

export type CreateLikeInput = z.infer<typeof createLikeSchema>;

