import { z } from 'zod';
export declare const createLikeSchema: z.ZodObject<{
    user_id: z.ZodUUID;
    post_id: z.ZodUUID;
}, z.core.$strip>;
export type CreateLikeInput = z.infer<typeof createLikeSchema>;
//# sourceMappingURL=likes.schema.d.ts.map