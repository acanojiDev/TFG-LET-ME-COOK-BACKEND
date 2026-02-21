// src/graphql/context.ts - VERSIÓN MEJORADA
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { prisma } from '../config/database';
import { createLoaders, Loaders } from '../dataloaders';
import { supabase } from '../config/supabase';

export interface Context {
	prisma: PrismaClient;
	req: Request;
	currentUserId?: string;
	currentUserEmail?: string;
	loaders: Loaders;
	isAuthenticated: boolean;
}

/**
 * Crear contexto para cada request de GraphQL
 * Valida el JWT de Supabase y extrae información del usuario
 */
export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
	let currentUserId: string | undefined;
	let currentUserEmail: string | undefined;
	let isAuthenticated = false;

	try {
		// Extraer token del header Authorization: Bearer {token}
		const authHeader = req.headers.authorization;

		if (authHeader && authHeader.startsWith('Bearer ')) {
			const token = authHeader.slice(7);
			if (token) {
				try {
					const { data: { user }, error } = await supabase.auth.getUser(token);
					if (!error && user) {
						currentUserId = user.id;
						currentUserEmail = user.email;
						isAuthenticated = true;
					}
				} catch (err: any) {
					console.error(`Error validando token: ${err.message}`);
				}
			}
		}
	} catch (err: any) {
		console.error(`Error en createContext: ${err.message}`);
	}

	return {
		prisma,
		req,
		currentUserId,
		currentUserEmail,
		loaders: createLoaders(prisma, currentUserId),
		isAuthenticated
	};
};
