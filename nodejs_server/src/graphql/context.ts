
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { prisma } from '../config/database';

export interface Context {
	prisma: PrismaClient;
	req: Request;
	currentUserId?: string;
}

export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
	const token = req.headers.authorization?.split(' ')[1];
	let currentUserId: string | undefined;

	if (token) {
		if (token.length > 20) {
			currentUserId = token;
		}
	}

	return {
		prisma,
		req,
		currentUserId
	};
};
