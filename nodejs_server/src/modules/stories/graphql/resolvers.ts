import { Context } from '../../../graphql/context';
import { NotAuthenticatedError, NotFoundError, ForbiddenError } from '../../../graphql/errors';
import { validate, CreateStoryInputSchema } from '../../../graphql/validation';

export const resolvers = {
	Story: {
		storyType: (parent: any) => parent.storyType ?? parent.story_type,
		mediaUrl: (parent: any) => parent.mediaUrl ?? parent.media_url,
		createdAt: (parent: any) => parent.createdAt ?? parent.created_at,
		expiresAt: (parent: any) => parent.expiresAt ?? parent.expires_at,

		// ✅ AHORA: USA DataLoader
		user: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.user.load(parent.user_id);
		},

		isActive: (parent: any) => {
			return new Date(parent.expires_at) > new Date();
		},

		// ✅ AHORA: USA DataLoader
		viewCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.storyViewCount.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		isViewedByCurrentUser: (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			return ctx.loaders.userViewedStory.load({ storyId: parent.id });
		},

		viewers: async (parent: any, _: any, ctx: Context) => {
			const viewedStories = await ctx.prisma.viewed_stories.findMany({
				where: { story_id: parent.id },
				include: { user: true },
				orderBy: { viewed_at: 'desc' }
			});
			return viewedStories.map((vs: { user: any; }) => vs.user);
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
			const followingIds = following.map((f: { followed_id: any; }) => f.followed_id);

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
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			const input = validate(CreateStoryInputSchema, args.input);
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
			if (!ctx.currentUserId) throw new NotAuthenticatedError();

			const story = await ctx.prisma.stories.findUnique({ where: { id: args.id } });
			if (!story) throw new NotFoundError('Story');
			if (story.user_id !== ctx.currentUserId) throw new ForbiddenError('delete this story');

			await ctx.prisma.stories.delete({ where: { id: args.id } });
			return true;
		},

		viewStory: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
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
