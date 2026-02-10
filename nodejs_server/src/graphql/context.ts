import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { prisma } from '../config/database';
import { createLoaders, Loaders } from '../dataloaders';
import { supabase } from '../config/supabase';

export interface Context {
	prisma: PrismaClient;
	req: Request;
	currentUserId?: string;
	loaders: Loaders;
}

export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
	const token = req.headers.authorization?.split(' ')[1];
	let currentUserId: string | undefined;

	if (token) {
		try {
			// Validar el JWT de Supabase y extraer el user ID del payload
			const { data: { user }, error } = await supabase.auth.getUser(token);
			if (!error && user) {
				currentUserId = user.id;
			}
		} catch (err) {
			console.error('Error validating token:', err);
			// Token inválido o expirado - currentUserId permanece undefined
		}
	}

	return {
		prisma,
		req,
		currentUserId,
		loaders: createLoaders(prisma, currentUserId)
	};
};
