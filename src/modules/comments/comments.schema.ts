import { z } from "zod";

export const createCommentSchema = z.object({
  post_id: z.string().uuid({ message: "Post ID must be a valid UUID" }),
  user_id: z.string().uuid({ message: "User ID must be a valid UUID" }),
  text: z.string().min(1, { message: "Comment text cannot be empty" }),
});

export const updateCommentSchema = z.object({
  text: z.string().min(1, { message: "Comment text cannot be empty" }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
