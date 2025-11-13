import { z } from 'zod'

export const createUserSchema = z.object({
	username: z.string().min(3, 'Username debe tener al menos 3 caracteres'),
	email: z.email('Email inválido'),
	password_hash: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
	photo_url: z.string().optional(),
	bio: z.string().optional(),
	location: z.string().optional(),
});

export const updateUserSchema = z.object({
	username: z.string().min(3).optional(),
	email: z.email().optional(),
	password_hash: z.string().min(6).optional(),
	photo_url: z.string().optional(),
	bio: z.string().optional(),
	location: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
