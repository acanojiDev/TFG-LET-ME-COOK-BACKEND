// src/graphql/context.ts - VERSIÓN MEJORADA
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { prisma } from '../config/database';
import { createLoaders, Loaders } from '../dataloaders';
import { supabase } from '../config/supabase';

export type UserType = 'PERSON' | 'RESTAURANT' | 'BAR';

export interface Context {
	prisma: PrismaClient;
	req: Request;
	currentUserId?: string;
	currentUserEmail?: string;
	currentUserType?: UserType;
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
	let currentUserType: UserType | undefined;
	let isAuthenticated = false;

	try {
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

						// Cargar el userType desde la BD para RBAC
						const dbUser = await prisma.users.findUnique({
							where: { id: user.id },
							select: { user_type: true }
						});
						if (dbUser) {
							currentUserType = dbUser.user_type as UserType;
						}
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
		currentUserType,
		loaders: createLoaders(prisma, currentUserId),
		isAuthenticated
	};
};
