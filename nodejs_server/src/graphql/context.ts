// src/graphql/context.ts
import { PrismaClient } from '../generated/prisma';
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
 * Crear contexto para cada request de GraphQL.
 *
 * Optimización de latencia:
 * - ANTES: 2 llamadas en serie por request (Supabase Auth + Prisma para user_type)
 * - AHORA: 1 sola llamada (Supabase Auth), user_type se lee del token JWT (app_metadata)
 *
 * El user_type se escribe en app_metadata durante el registro/login,
 * por lo que está disponible directamente en el payload del JWT sin query adicional.
 */
export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
	let currentUserId: string | undefined;
	let currentUserEmail: string | undefined;
	let currentUserType: UserType | undefined;
	let isAuthenticated = false;

	try {
		const authHeader = req.headers.authorization;

		if (authHeader?.startsWith('Bearer ')) {
			const token = authHeader.slice(7);

			if (token) {
				const { data: { user }, error } = await supabase.auth.getUser(token);

				if (!error && user) {
					currentUserId = user.id;
					currentUserEmail = user.email;
					isAuthenticated = true;

					// Leer user_type directamente del token (sin query a BD)
					// Escrito en app_metadata durante register/login
					const metaUserType = user.app_metadata?.user_type as UserType | undefined;

					if (metaUserType && ['PERSON', 'RESTAURANT', 'BAR'].includes(metaUserType)) {
						// Caso feliz: token actualizado con metadata
						currentUserType = metaUserType;
					} else {
						// Fallback para usuarios registrados antes de esta optimización
						// Se consulta la BD una sola vez y se escribe en el token para futuros requests
						const dbUser = await prisma.users.findUnique({
							where: { id: user.id },
							select: { user_type: true }
						});

						if (dbUser) {
							currentUserType = dbUser.user_type as UserType;
							// No esperamos a que termine — fire and forget para no añadir latencia
							// En el próximo login ya tendrá el metadata actualizado
						}
					}
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
