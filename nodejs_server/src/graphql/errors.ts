import { GraphQLError } from 'graphql';

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
