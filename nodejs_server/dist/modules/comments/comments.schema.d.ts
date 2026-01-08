import { z } from "zod";
export declare const createCommentSchema: z.ZodObject<{
    post_id: z.ZodString;
    user_id: z.ZodString;
    text: z.ZodString;
}, z.core.$strip>;
export declare const updateCommentSchema: z.ZodObject<{
    text: z.ZodString;
}, z.core.$strip>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
//# sourceMappingURL=comments.schema.d.ts.map