import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodEmail;
    password_hash: z.ZodString;
    photo_url: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    birth_date: z.ZodDate;
    location: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    password_hash: z.ZodOptional<z.ZodString>;
    photo_url: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    birth_date: z.ZodDate;
    location: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export declare const followUserSchema: z.ZodObject<{
    followed_id: z.ZodString;
}, z.core.$strip>;
export declare const updateSettingsSchema: z.ZodObject<{
    is_private: z.ZodOptional<z.ZodBoolean>;
    language: z.ZodOptional<z.ZodString>;
    notify_likes: z.ZodOptional<z.ZodBoolean>;
    notify_comments: z.ZodOptional<z.ZodBoolean>;
    notify_follows: z.ZodOptional<z.ZodBoolean>;
    theme: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FollowUserInput = z.infer<typeof followUserSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
//# sourceMappingURL=user.schema.d.ts.map