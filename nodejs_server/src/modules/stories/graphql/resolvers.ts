import { Context } from '../../../graphql/context';

export const resolvers = {
	Story: {
		user: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.users.findUnique({
				where: { id: parent.user_id }
			});
		},

		isActive: (parent: any) => {
			return new Date(parent.expires_at) > new Date();
		},

		viewCount: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.viewed_stories.count({
				where: { story_id: parent.id }
			});
		},

		isViewedByCurrentUser: async (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			const viewed = await ctx.prisma.viewed_stories.findUnique({
				where: {
					user_id_story_id: {
						user_id: ctx.currentUserId,
						story_id: parent.id
					}
				}
			});
			return !!viewed;
		},

		viewers: async (parent: any, _: any, ctx: Context) => {
			const viewedStories = await ctx.prisma.viewed_stories.findMany({
				where: { story_id: parent.id },
				include: { user: true },
				orderBy: { viewed_at: 'desc' }
			});
			return viewedStories.map(vs => vs.user);
		}
	},

	User: {
		stories: async (parent: any, args: any, ctx: Context) => {
			const { onlyActive = true } = args;
			return await ctx.prisma.stories.findMany({
				where: {
					user_id: parent.id,
					...(onlyActive ? { expires_at: { gt: new Date() } } : {})
				},
				orderBy: { created_at: 'desc' }
			});
		}
	},

	Query: {
		homeStories: async (_: any, __: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			// Following IDs
			const following = await ctx.prisma.follows.findMany({
				where: { follower_id: ctx.currentUserId },
				select: { followed_id: true }
			});
			const followingIds = following.map(f => f.followed_id);

			return await ctx.prisma.stories.findMany({
				where: {
					user_id: { in: followingIds },
					expires_at: { gt: new Date() }
				},
				orderBy: { created_at: 'desc' }
			});
		}
	},

	Mutation: {
		createStory: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			const { input } = args;
			const expiresAt = new Date();
			expiresAt.setHours(expiresAt.getHours() + 24);

			return await ctx.prisma.stories.create({
				data: {
					user_id: ctx.currentUserId,
					story_type: input.storyType,
					media_url: input.mediaUrl,
					expires_at: expiresAt
				}
			});
		},

		deleteStory: async (_: any, args: any, ctx: Context) => {
			await ctx.prisma.stories.delete({ where: { id: args.id } }); // Add check for ownership
			return true;
		},

		viewStory: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			await ctx.prisma.viewed_stories.upsert({
				where: {
					user_id_story_id: {
						user_id: ctx.currentUserId,
						story_id: args.storyId
					}
				},
				create: {
					user_id: ctx.currentUserId,
					story_id: args.storyId
				},
				update: {
					viewed_at: new Date()
				}
			});
			return await ctx.prisma.stories.findUnique({ where: { id: args.storyId } });
		}
	}
};
