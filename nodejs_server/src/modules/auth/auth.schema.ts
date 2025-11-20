import {email, z} from "zod"

export const signUpSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    username: z.string().min(3),
    photo_url: z.url().optional(),
    bio: z.string().optional(),
    location: z.string().optional
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});