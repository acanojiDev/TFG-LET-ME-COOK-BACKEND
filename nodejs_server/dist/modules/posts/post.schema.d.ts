import { z } from "zod";
export declare const createPostSchema: z.ZodObject<{
    user_id: z.ZodString;
    type: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    media_url: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updatePostSchema: z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
    media_url: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const savePostSchema: z.ZodObject<{
    post_id: z.ZodString;
}, z.core.$strip>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type SavePostInput = z.infer<typeof savePostSchema>;
//# sourceMappingURL=post.schema.d.ts.map