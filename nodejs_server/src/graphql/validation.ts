import { z } from 'zod';
import { ValidationError } from './errors';

// ── Helpers ────────────────────────────────────────────────────────────────

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
	console.log('🔍 Validating data:', JSON.stringify(data, null, 2));
	const result = schema.safeParse(data);
	if (!result.success) {
		console.error('❌ Validation error details:', JSON.stringify(result.error.issues, null, 2));
		const first = result.error.issues[0];
		const field = first.path.join('.');
		throw new ValidationError(first.message, field || undefined);
	}
	return result.data;
}

// ── User schemas ───────────────────────────────────────────────────────────

export const PersonProfileInputSchema = z.object({
	username: z.string().max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores').optional().nullable(),
	fullName: z.string().max(100).optional().nullable(),
	photoUrl: z.url().optional().nullable(),
	bio: z.string().max(500).optional().nullable(),
	location: z.string().max(100).optional().nullable(),
	birthDate: z.union([z.string(), z.date()]).optional().nullable()
});

export const BusinessProfileInputSchema = z.object({
	businessName: z.string().min(1).max(100).optional().nullable(),
	photoUrl: z.url().optional().nullable(),
	bio: z.string().max(500).optional().nullable(),
	location: z.string().max(200).optional().nullable(),
	specialty: z.string().max(100).optional().nullable(),
	phone: z.string().max(20).optional().nullable(),
	website: z.url().optional().nullable()
});

export const RegisterInputSchema = z.object({
	email: z.email(),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	userType: z.enum(['PERSON', 'RESTAURANT', 'BAR']),
	personData: PersonProfileInputSchema.optional().nullable(),
	businessData: BusinessProfileInputSchema.optional().nullable(),
	allergenIds: z.array(z.string()).optional().nullable(),
	preferenceIds: z.array(z.string()).optional().nullable()
});

export const LoginInputSchema = z.object({
	email: z.email(),
	password: z.string().min(1, 'Password is required')
});

export const UpdateAllergyInputSchema = z.object({
	allergenIds: z.array(z.string().uuid()).min(0)
});

export const UpdatePreferenceInputSchema = z.object({
	preferenceIds: z.array(z.string().uuid()).min(0)
});

// ── Post schemas ───────────────────────────────────────────────────────────

const POST_CATEGORIES = [
	'TRENDING', 'ITALIAN', 'MEXICAN', 'JAPANESE', 'CHINESE', 'DESSERTS',
	'VEGAN', 'QUICK_EASY', 'BURGER', 'SEAFOOD', 'COCKTAILS', 'BREAKFAST',
	'LUNCH', 'DINNER', 'SNACKS', 'HEALTHY', 'COMFORT_FOOD', 'STREET_FOOD'
] as const;

export const CreateRecipeInputSchema = z.object({
	name: z.string().min(1).max(200),
	description: z.string().max(1000).optional(),
	steps: z.string().min(1),
	difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
	timeRequired: z.number().int().positive().optional(),
	estimatedCost: z.number().positive().optional(),
	servings: z.number().int().positive().optional(),
	ingredients: z.array(z.object({
		ingredientId: z.string().uuid(),
		quantity: z.number().positive(),
		notes: z.string().max(200).optional()
	})).min(1)
});

export const CreatePostInputSchema = z.object({
	postType: z.enum(['PHOTO', 'VIDEO', 'TEXT', 'RECIPE']),
	title: z.string().min(1).max(200).optional(),
	description: z.string().max(2000).optional(),
	categories: z.array(z.enum(POST_CATEGORIES)).min(1),
	mediaUrls: z.array(z.url()).optional(),
	recipe: CreateRecipeInputSchema.optional()
});

export const UpdatePostInputSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	description: z.string().max(2000).optional(),
	categories: z.array(z.enum(POST_CATEGORIES)).min(1).optional()
});

export const CommentInputSchema = z.object({
	text: z.string().min(1, 'Comment cannot be empty').max(1000)
});

// ── Place schemas ──────────────────────────────────────────────────────────

export const ReviewPlaceInputSchema = z.object({
	placeId: z.string().uuid(),
	rating: z.number().min(1).max(5),
	comment: z.string().max(1000).optional(),
	photoUrl: z.url().optional()
});

// ── Story schemas ──────────────────────────────────────────────────────────

export const CreateStoryInputSchema = z.object({
	storyType: z.enum(['PHOTO', 'VIDEO']),
	mediaUrl: z.url()
});
