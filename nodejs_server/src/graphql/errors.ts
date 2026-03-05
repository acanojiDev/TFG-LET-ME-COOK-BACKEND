import { GraphQLError } from 'graphql';
import type { UserType } from './context';

export class NotAuthenticatedError extends GraphQLError {
	constructor() {
		super('Not authenticated', {
			extensions: { code: 'UNAUTHENTICATED' }
		});
	}
}

export class NotFoundError extends GraphQLError {
	constructor(resource: string) {
		super(`${resource} not found`, {
			extensions: { code: 'NOT_FOUND', resource }
		});
	}
}

export class ForbiddenError extends GraphQLError {
	constructor(action: string) {
		super(`Not authorized to ${action}`, {
			extensions: { code: 'FORBIDDEN', action }
		});
	}
}

export class ValidationError extends GraphQLError {
	constructor(message: string, field?: string) {
		super(message, {
			extensions: { code: 'BAD_USER_INPUT', ...(field && { field }) }
		});
	}
}

export class ConflictError extends GraphQLError {
	constructor(message: string) {
		super(message, {
			extensions: { code: 'CONFLICT' }
		});
	}
}

// ── RBAC helpers ───────────────────────────────────────────────────────────

/**
 * Lanza ForbiddenError si el userType del contexto no está en la lista permitida.
 * Uso: requireRole(ctx, ['PERSON'], 'follow users')
 */
export function requireRole(
	ctx: { currentUserId?: string; currentUserType?: UserType },
	allowed: UserType[],
	action: string
): void {
	if (!ctx.currentUserId) throw new NotAuthenticatedError();
	if (!ctx.currentUserType || !allowed.includes(ctx.currentUserType)) {
		throw new ForbiddenError(
			`${action} (requires role: ${allowed.join(' or ')}, current: ${ctx.currentUserType ?? 'unknown'})`
		);
	}
}

/** Solo usuarios PERSON pueden realizar la accion */
export function requirePerson(
	ctx: { currentUserId?: string; currentUserType?: UserType },
	action: string
): void {
	requireRole(ctx, ['PERSON'], action);
}

/** Solo negocios (RESTAURANT o BAR) pueden realizar la accion */
export function requireBusiness(
	ctx: { currentUserId?: string; currentUserType?: UserType },
	action: string
): void {
	requireRole(ctx, ['RESTAURANT', 'BAR'], action);
}
