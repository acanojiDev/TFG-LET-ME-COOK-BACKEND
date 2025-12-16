import { z } from 'zod'

export const createUserSchema = z.object({
	username: z.string().min(3, 'Username debe tener al menos 3 caracteres'),
	email: z.email('Email inválido'),
	password_hash: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
	photo_url: z.string().optional(),
	bio: z.string().optional(),
	birth_date: z.date(),
	location: z.string().optional(),
});

export const updateUserSchema = z.object({
	username: z.string().min(3).optional(),
	email: z.email().optional(),
	password_hash: z.string().min(6).optional(),
	photo_url: z.string().optional(),
	bio: z.string().optional(),
	birth_date: z.date(),
	location: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const followUserSchema = z.object({
	followed_id: z.string().uuid({ message: "Followed ID must be a valid UUID" }),
});

export const updateSettingsSchema = z.object({
	is_private: z.boolean().optional(),
	language: z.string().optional(),
	notify_likes: z.boolean().optional(),
	notify_comments: z.boolean().optional(),
	notify_follows: z.boolean().optional(),
	theme: z.string().optional(),
});

export type FollowUserInput = z.infer<typeof followUserSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

