
import { PrismaClient } from '@prisma/client';
import { Context } from '../../../graphql/context';

export const resolvers = {
	Place: {
		// ✅ AHORA: USA DataLoader
		averageRating: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.placeAverageRating.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		reviewCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.placeReviewCount.load(parent.id);
		},

		reviews: async (parent: any, args: any, ctx: Context) => {
			const { first = 20, after } = args;
			const reviews = await ctx.prisma.place_reviews.findMany({
				where: { place_id: parent.id },
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: { created_at: 'desc' }
			});

			const hasNextPage = reviews.length > first;
			const edges = reviews.slice(0, first).map(review => ({
				node: review,
				cursor: review.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.place_reviews.count({
					where: { place_id: parent.id }
				})
			};
		}
	},

	Query: {
		places: async (_: any, args: any, ctx: Context) => {
			const { placeType, filters, nearLocation, first = 20, after } = args;
			return await ctx.prisma.places.findMany({
				where: {
					place_type: placeType,
					...(filters ? { filters: { hasSome: filters } } : {}),
					...(nearLocation ? { location: { contains: nearLocation } } : {})
				},
				take: first,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined
			});
		},

		place: async (_: any, args: any, ctx: Context) => {
			return await ctx.prisma.places.findUnique({ where: { id: args.id } });
		},

		searchPlaces: async (_: any, args: any, ctx: Context) => {
			const { query, first = 20 } = args;
			return await ctx.prisma.places.findMany({
				where: {
					OR: [
						{ name: { contains: query, mode: 'insensitive' } },
						{ description: { contains: query, mode: 'insensitive' } }
					]
				},
				take: first
			});
		}
	},

	Mutation: {
		reviewPlace: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			// Create review
			return await ctx.prisma.place_reviews.create({
				data: {
					user_id: ctx.currentUserId,
					place_id: args.placeId,
					rating: args.rating,
					comment: args.comment,
					photo_url: args.photoUrl,
					created_at: new Date()
				}
			});
		}
	}
};
