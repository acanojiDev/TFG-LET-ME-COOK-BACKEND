import { Context } from '../../../graphql/context';
import { supabase } from '../../../config/supabase';
import {
	NotAuthenticatedError,
	NotFoundError,
	ConflictError,
	requirePerson,
	ForbiddenError
} from '../../../graphql/errors';
import {
	validate,
	RegisterInputSchema,
	LoginInputSchema,
	PersonProfileInputSchema,
	BusinessProfileInputSchema,
	UpdateAllergyInputSchema,
	UpdatePreferenceInputSchema
} from '../../../graphql/validation';

export const resolvers = {
	User: {
		email: async (parent: any, _: any, ctx: Context) => {
			if (ctx.currentUserId && ctx.currentUserId === parent.id) {
				return ctx.currentUserEmail ?? null;
			}
			return null;
		},

		// ✅ USA DataLoader — evita N+1 en listas de usuarios
		personProfile: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.personProfile.load(parent.id);
		},

		// ✅ USA DataLoader — evita N+1 en listas de negocios
		businessProfile: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.businessProfile.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		postCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.postCount.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		followerCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.followerCount.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		followingCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.followingCount.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		isFollowedByCurrentUser: (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			return ctx.loaders.isFollowing.load({ followedId: parent.id });
		},

		// ✅ AHORA: USA DataLoader
		isFollowingCurrentUser: (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			return ctx.loaders.isFollowedBy.load({ followerId: parent.id });
		},

		// ✅ Estos permanecen igual (ya tienen paginación)
		followers: async (parent: any, args: any, ctx: Context) => {
			const { first = 20, after } = args;
			const skip = after ? parseInt(after) : 0;

			const follows = await ctx.prisma.follows.findMany({
				where: { followed_id: parent.id },
				take: first + 1,
				skip: skip,
				include: { follower: true }
			});

			const hasNextPage = follows.length > first;
			const edges = follows.slice(0, first).map((f: any, index: number) => ({
				node: f.follower,
				cursor: (skip + index + 1).toString()
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after && parseInt(after) > 0,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.follows.count({
					where: { followed_id: parent.id }
				})
			};
		},

		following: async (parent: any, args: any, ctx: Context) => {
			const { first = 20, after } = args;
			const skip = after ? parseInt(after) : 0;

			const follows = await ctx.prisma.follows.findMany({
				where: { follower_id: parent.id },
				take: first + 1,
				skip: skip,
				include: { followed: true }
			});

			const hasNextPage = follows.length > first;
			const edges = follows.slice(0, first).map((f: any, index: number) => ({
				node: f.followed,
				cursor: (skip + index + 1).toString()
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after && parseInt(after) > 0,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.follows.count({
					where: { follower_id: parent.id }
				})
			};
		}
	},

	Query: {
		me: async (_: any, __: any, ctx: Context) => {
			if (!ctx.currentUserId) return null;
			return await ctx.prisma.users.findUnique({
				where: { id: ctx.currentUserId }
			});
		},

		user: async (_: any, args: any, ctx: Context) => {
			return await ctx.prisma.users.findUnique({
				where: { id: args.id }
			});
		},

		userByUsername: async (_: any, args: any, ctx: Context) => {
			const profile = await ctx.prisma.person_profiles.findUnique({
				where: { username: args.username },
				include: { user: true }
			});
			return profile?.user || null;
		},

		searchUsers: async (_: any, args: any, ctx: Context) => {
			const { query, first = 20 } = args;

			return await ctx.prisma.users.findMany({
				where: {
					OR: [
						{ person_profile: { username: { contains: query, mode: 'insensitive' } } },
						{ business_profile: { business_name: { contains: query, mode: 'insensitive' } } }
					]
				},
				take: first
			});
		},

		allergens: async (_: any, __: any, ctx: Context) => {
			return await ctx.prisma.allergens.findMany();
		},

		preferences: async (_: any, __: any, ctx: Context) => {
			return await ctx.prisma.preferences.findMany();
		}
	},

	Mutation: {
		register: async (_: any, args: any, ctx: Context) => {
			const { email, password, userType, personData, businessData, allergenIds, preferenceIds } = validate(RegisterInputSchema, args);

			// 1. Crear usuario en Supabase Auth
			const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
			if (authError) throw new ConflictError(authError.message);
			if (!authData.user) throw new ConflictError('User creation failed');

			const userId = authData.user.id;

			// 2. Crear registro en tabla users
			await ctx.prisma.users.upsert({
				where: { id: userId },
				create: { id: userId, user_type: userType, created_at: new Date(), updated_at: new Date() },
				update: { updated_at: new Date() }
			});

			// 3. Crear perfil según tipo de usuario
			if (userType === 'PERSON') {
				const username = personData?.username ?? email.split('@')[0].toLowerCase();
				await ctx.prisma.person_profiles.upsert({
					where: { user_id: userId },
					create: {
						user_id: userId,
						username: username.toLowerCase(),
						full_name: personData?.fullName ?? null,
						photo_url: personData?.photoUrl ?? null,
						bio: personData?.bio ?? null,
						location: personData?.location ?? null,
						birth_date: personData?.birthDate ? new Date(personData.birthDate) : new Date()
					},
					update: {} // ya existe: no sobreescribir en register
				});
			} else if ((userType === 'RESTAURANT' || userType === 'BAR') && businessData) {
				await ctx.prisma.business_profiles.upsert({
					where: { user_id: userId },
					create: {
						user_id: userId,
						business_name: businessData.businessName ?? email.split('@')[0],
						photo_url: businessData.photoUrl ?? null,
						bio: businessData.bio ?? null,
						location: businessData.location ?? '',
						specialty: businessData.specialty ?? null,
						phone: businessData.phone ?? null,
						website: businessData.website ?? null
					},
					update: {} // ya existe: no sobreescribir en register
				});
			}

			// 4. Guardar alergias y preferencias iniciales (solo PERSON)
			if (userType === 'PERSON') {
				if (allergenIds && allergenIds.length > 0) {
					await ctx.prisma.user_allergies.createMany({
						data: allergenIds.map((allergenId) => ({ user_id: userId, allergen_id: allergenId })),
						skipDuplicates: true
					});
				}
				if (preferenceIds && preferenceIds.length > 0) {
					await ctx.prisma.user_preferences.createMany({
						data: preferenceIds.map((preferenceId) => ({ user_id: userId, preference_id: preferenceId })),
						skipDuplicates: true
					});
				}
			}

			return {
				token: authData.session?.access_token ?? 'check-email-confirmation',
				user: {
					id: userId,
					email,
					userType,
					createdAt: new Date()
				}
			};
		},

		login: async (_: any, args: any, ctx: Context) => {
			const { email, password } = validate(LoginInputSchema, args);
			const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
			if (authError) throw new ConflictError(authError.message);
			if (!authData.user || !authData.session) throw new ConflictError('Login failed');

			const userId = authData.user.id;

			// Recuperar o crear registro en BD (por si el usuario existía en Supabase pero no en la BD)
			let dbUser = await ctx.prisma.users.findUnique({ where: { id: userId } });
			if (!dbUser) {
				dbUser = await ctx.prisma.users.create({
					data: { id: userId, user_type: 'PERSON', created_at: new Date(), updated_at: new Date() }
				});
			}

			return {
				token: authData.session.access_token,
				user: {
					id: userId,
					email,
					userType: dbUser.user_type,
					createdAt: dbUser.created_at
				}
			};
		},

		followUser: async (_: any, args: any, ctx: Context) => {
			requirePerson(ctx, 'follow users');
			const currentUserId = ctx.currentUserId as string;

			if (currentUserId === args.userId) throw new ForbiddenError('No puedes seguirte a ti mismo');

			const target = await ctx.prisma.users.findUnique({ where: { id: args.userId } });
			if (!target) throw new NotFoundError('User');

			// upsert evita error si el follow ya existe
			await ctx.prisma.follows.upsert({
				where: {
					follower_id_followed_id: {
						follower_id: currentUserId,
						followed_id: args.userId
					}
				},
				create: { follower_id: currentUserId, followed_id: args.userId },
				update: {}
			});
			return target;
		},

		unfollowUser: async (_: any, args: any, ctx: Context) => {
			requirePerson(ctx, 'unfollow users');
			const currentUserId = ctx.currentUserId as string;

			// deleteMany evita error si el follow no existe
			await ctx.prisma.follows.deleteMany({
				where: {
					follower_id: currentUserId,
					followed_id: args.userId
				}
			});
			return await ctx.prisma.users.findUnique({ where: { id: args.userId } });
		},

		updateProfile: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			const { personData, businessData } = args;

			const user = await ctx.prisma.users.findUnique({ where: { id: ctx.currentUserId } });
			if (!user) throw new NotFoundError('User');

			if (user.user_type === 'PERSON' && personData) {
				const data = validate(PersonProfileInputSchema, personData);
				await ctx.prisma.person_profiles.update({
					where: { user_id: ctx.currentUserId },
					data: {
						...(data.username && { username: data.username }),
						...(data.fullName !== undefined && { full_name: data.fullName }),
						...(data.photoUrl !== undefined && { photo_url: data.photoUrl }),
						...(data.bio !== undefined && { bio: data.bio }),
						...(data.location !== undefined && { location: data.location }),
						...(data.birthDate !== undefined && { birth_date: data.birthDate ? new Date(data.birthDate) : undefined })
					}
				});
			} else if ((user.user_type === 'RESTAURANT' || user.user_type === 'BAR') && businessData) {
				const data = validate(BusinessProfileInputSchema, businessData);
				await ctx.prisma.business_profiles.update({
					where: { user_id: ctx.currentUserId },
					data: {
						...(data.businessName && { business_name: data.businessName }),
						...(data.photoUrl !== undefined && { photo_url: data.photoUrl }),
						...(data.bio !== undefined && { bio: data.bio }),
						...(data.location !== undefined && { location: data.location ?? '' }),
						...(data.specialty !== undefined && { specialty: data.specialty }),
						...(data.phone !== undefined && { phone: data.phone }),
						...(data.website !== undefined && { website: data.website })
					}
				});
			}

			return await ctx.prisma.users.findUnique({ where: { id: ctx.currentUserId } });
		},

		updateAllergies: async (_: any, args: any, ctx: Context) => {
			requirePerson(ctx, 'update allergies');
			const { allergenIds } = validate(UpdateAllergyInputSchema, args);

			await ctx.prisma.user_allergies.deleteMany({ where: { user_id: ctx.currentUserId } });
			if (allergenIds.length > 0) {
				await ctx.prisma.user_allergies.createMany({
					data: allergenIds.map((allergenId) => ({
						user_id: ctx.currentUserId as string,
						allergen_id: allergenId
					}))
				});
			}

			return await ctx.prisma.users.findUnique({ where: { id: ctx.currentUserId } });
		},

		updatePreferences: async (_: any, args: any, ctx: Context) => {
			requirePerson(ctx, 'update preferences');
			const { preferenceIds } = validate(UpdatePreferenceInputSchema, args);

			await ctx.prisma.user_preferences.deleteMany({ where: { user_id: ctx.currentUserId } });
			if (preferenceIds.length > 0) {
				await ctx.prisma.user_preferences.createMany({
					data: preferenceIds.map((preferenceId) => ({
						user_id: ctx.currentUserId as string,
						preference_id: preferenceId
					}))
				});
			}

			return await ctx.prisma.users.findUnique({ where: { id: ctx.currentUserId } });
		}
	}
};
