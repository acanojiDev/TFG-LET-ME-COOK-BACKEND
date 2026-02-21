import { Context } from '../../../graphql/context';
import { supabase } from '../../../config/supabase';
import {
	NotAuthenticatedError,
	NotFoundError,
	ConflictError
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

		personProfile: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.person_profiles.findUnique({
				where: { user_id: parent.id }
			});
		},

		businessProfile: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.business_profiles.findUnique({
				where: { user_id: parent.id }
			});
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
			const edges = follows.slice(0, first).map((f, index) => ({
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
			const edges = follows.slice(0, first).map((f, index) => ({
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
		// ✅ Mutations permanecen igual
		register: async (_: any, args: any, ctx: Context) => {
			const { email, password, userType, personData, businessData } = validate(RegisterInputSchema, args);

			const metaData: any = { user_type: userType };

			if (userType === 'PERSON' && personData) {
				Object.assign(metaData, personData);
				if (personData.birthDate) metaData.birth_date = personData.birthDate;
				if (personData.photoUrl) metaData.photo_url = personData.photoUrl;
			} else if (businessData) {
				Object.assign(metaData, businessData);
				if (businessData.businessName) metaData.business_name = businessData.businessName;
				if (businessData.photoUrl) metaData.photo_url = businessData.photoUrl;
			}

			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: { data: metaData }
			});

			if (error) throw new ConflictError(error.message);
			if (!data.user) throw new ConflictError('User creation failed');

			return {
				token: data.session?.access_token || 'check-email-confirmation',
				user: {
					id: data.user.id,
					email,
					userType,
					createdAt: new Date()
				}
			};
		},

		login: async (_: any, args: any, ctx: Context) => {
			const { email, password } = validate(LoginInputSchema, args);
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw new ConflictError(error.message);

			const dbUser = await ctx.prisma.users.findUnique({ where: { id: data.user.id } });

			return {
				token: data.session.access_token,
				user: {
					id: data.user.id,
					email,
					userType: dbUser?.user_type || 'PERSON',
					createdAt: new Date()
				}
			};
		},

		followUser: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			const target = await ctx.prisma.users.findUnique({ where: { id: args.userId } });
			if (!target) throw new NotFoundError('User');
			await ctx.prisma.follows.create({
				data: { follower_id: ctx.currentUserId, followed_id: args.userId }
			});
			return target;
		},

		unfollowUser: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			await ctx.prisma.follows.delete({
				where: {
					follower_id_followed_id: {
						follower_id: ctx.currentUserId,
						followed_id: args.userId
					}
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
						...(data.username !== undefined && { username: data.username }),
						...(data.fullName !== undefined && { full_name: data.fullName }),
						...(data.photoUrl !== undefined && { photo_url: data.photoUrl }),
						...(data.bio !== undefined && { bio: data.bio }),
						...(data.location !== undefined && { location: data.location }),
						...(data.birthDate !== undefined && { birth_date: new Date(data.birthDate) })
					}
				});
			} else if ((user.user_type === 'RESTAURANT' || user.user_type === 'BAR') && businessData) {
				const data = validate(BusinessProfileInputSchema, businessData);
				await ctx.prisma.business_profiles.update({
					where: { user_id: ctx.currentUserId },
					data: {
						...(data.businessName !== undefined && { business_name: data.businessName }),
						...(data.photoUrl !== undefined && { photo_url: data.photoUrl }),
						...(data.bio !== undefined && { bio: data.bio }),
						...(data.location !== undefined && { location: data.location }),
						...(data.specialty !== undefined && { specialty: data.specialty }),
						...(data.phone !== undefined && { phone: data.phone }),
						...(data.website !== undefined && { website: data.website })
					}
				});
			}

			return await ctx.prisma.users.findUnique({ where: { id: ctx.currentUserId } });
		},

		updateAllergies: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
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
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
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
