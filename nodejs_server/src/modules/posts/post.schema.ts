import { z } from "zod";

export const createPostSchema = z.object({
	type: z.string().min(1, { message: "Type is required" }),
	content: z.string().optional(),
	media_url: z.string().optional(),
});

export const updatePostSchema = z.object({
	content: z.string().optional(),
	media_url: z.string().optional(),
});

export const savePostSchema = z.object({
	post_id: z.string().uuid({ message: "Post ID must be a valid UUID" }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type SavePostInput = z.infer<typeof savePostSchema>;
