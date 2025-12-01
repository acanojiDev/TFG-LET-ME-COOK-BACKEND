export interface RegisterPayload {
	username: string;
	email: string;
	day: number;
	month: number;
	year: number;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface JWTPayload {
	userId: string;
	email: string;
	username: string;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	data?: {
		token: string;
		user: {
			id: string;
			username: string;
			email: string;
			photo_url: string | null;
			bio: string | null;
			location: string | null;
		};
	};
}

declare global {
	namespace Express {
		interface Request {
			userId?: string;
			user?: {
				userId: string;
				email: string;
				username: string;
			};
		}
	}
}
