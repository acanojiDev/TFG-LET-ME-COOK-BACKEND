import { Context } from '../../../graphql/context';
import { supabase } from '../../../config/supabase';

export const resolvers = {
	User: {
		email: () => "user@example.com",

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
			console.log('📊 [Query] userByUsername - USA idx_person_profiles_username_idx');

			const profile = await ctx.prisma.person_profiles.findUnique({
				where: { username: args.username },
				include: { user: true }
			});
			return profile?.user || null;
		},

		searchUsers: async (_: any, args: any, ctx: Context) => {
			const { query, first = 20 } = args;

			console.log('📊 [Query] searchUsers - Búsqueda simple');

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
			const { email, password, userType, personData, businessData } = args;

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

			if (error) throw new Error(error.message);
			if (!data.user) throw new Error('User creation failed');

			return {
				token: data.session?.access_token || "check-email-confirmation",
				user: {
					id: data.user.id,
					email,
					userType,
					createdAt: new Date()
				}
			};
		},

		login: async (_: any, args: any, ctx: Context) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: args.email,
				password: args.password
			});
			if (error) throw new Error(error.message);

			const dbUser = await ctx.prisma.users.findUnique({ where: { id: data.user.id } });

			return {
				token: data.session.access_token,
				user: {
					id: data.user.id,
					email: args.email,
					userType: dbUser?.user_type || 'PERSON',
					createdAt: new Date()
				}
			};
		},

		followUser: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			await ctx.prisma.follows.create({
				data: {
					follower_id: ctx.currentUserId,
					followed_id: args.userId
				}
			});
			return await ctx.prisma.users.findUnique({
				where: { id: args.userId }
			});
		},

		unfollowUser: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			await ctx.prisma.follows.delete({
				where: {
					follower_id_followed_id: {
						follower_id: ctx.currentUserId,
						followed_id: args.userId
					}
				}
			});
			return await ctx.prisma.users.findUnique({
				where: { id: args.userId }
			});
		},

		updateProfile: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			return await ctx.prisma.users.findUnique({ where: { id: ctx.currentUserId } });
		},

		updateAllergies: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			return await ctx.prisma.users.findUnique({ where: { id: ctx.currentUserId } });
		},

		updatePreferences: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			return await ctx.prisma.users.findUnique({ where: { id: ctx.currentUserId } });
		}
	}
};
