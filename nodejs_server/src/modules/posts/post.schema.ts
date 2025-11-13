import { z } from 'zod';

const postTypeEnum = z.enum(['recipe', 'photo', 'video', 'text']);

export const createPostSchema = z.object({
	user_id: z.uuid('user_id debe ser un UUID válido'),
	type: postTypeEnum,
	content: z.string().min(1, 'El contenido no puede estar vacío').optional(),
	media_url: z.url('URL de media inválida').optional(),
});

export const updatePostSchema = z.object({
	user_id: z.uuid('user_id debe ser un UUID válido').optional(),
	type: postTypeEnum.optional(),
	content: z.string().min(1, 'El contenido no puede estar vacío').optional(),
	media_url: z.url('URL de media inválida').optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

