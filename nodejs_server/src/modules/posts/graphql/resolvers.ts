
import { Context } from '../../../graphql/context';

export const resolvers = {
	Post: {
		user: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.users.findUnique({
				where: { id: parent.user_id }
			});
		},

		media: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.post_media.findMany({
				where: { post_id: parent.id },
				orderBy: { position: 'asc' }
			});
		},

		recipe: async (parent: any, _: any, ctx: Context) => {
			if (parent.post_type !== 'RECIPE') return null;
			return await ctx.prisma.recipes.findUnique({
				where: { post_id: parent.id }
			});
		},

		likeCount: async (parent: any, _: any, ctx: Context) => {
			// Redis cache logic omitted
			return await ctx.prisma.likes.count({
				where: { post_id: parent.id }
			});
		},

		commentCount: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.comments.count({
				where: { post_id: parent.id }
			});
		},

		saveCount: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.saved_posts.count({
				where: { post_id: parent.id }
			});
		},

		viewCount: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.viewed_posts.count({
				where: { post_id: parent.id }
			});
		},

		isLikedByCurrentUser: async (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			const like = await ctx.prisma.likes.findUnique({
				where: {
					user_id_post_id: {
						user_id: ctx.currentUserId,
						post_id: parent.id
					}
				}
			});
			return !!like;
		},

		isSavedByCurrentUser: async (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			const saved = await ctx.prisma.saved_posts.findUnique({
				where: {
					user_id_post_id: {
						user_id: ctx.currentUserId,
						post_id: parent.id
					}
				}
			});
			return !!saved;
		},

		isViewedByCurrentUser: async (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			const viewed = await ctx.prisma.viewed_posts.findUnique({
				where: {
					user_id_post_id: {
						user_id: ctx.currentUserId,
						post_id: parent.id
					}
				}
			});
			return !!viewed;
		},

		comments: async (parent: any, args: any, ctx: Context) => {
			const { first = 20, after } = args;
			const comments = await ctx.prisma.comments.findMany({
				where: { post_id: parent.id },
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: { created_at: 'desc' }
			});

			const hasNextPage = comments.length > first;
			const edges = comments.slice(0, first).map(comment => ({
				node: comment,
				cursor: comment.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.comments.count({
					where: { post_id: parent.id }
				})
			};
		},

		likes: async (parent: any, args: any, ctx: Context) => {
			// Implementation for likes connection or list
			// Prompt says [User!]! and args (first: Int)
			const { first = 20 } = args;
			const likes = await ctx.prisma.likes.findMany({
				where: { post_id: parent.id },
				take: first,
				include: { user: true }
			});
			return likes.map(l => l.user);
		}
	},

	User: {
		posts: async (parent: any, args: any, ctx: Context) => {
			const { first = 20, after, orderBy } = args;

			const posts = await ctx.prisma.posts.findMany({
				where: { user_id: parent.id },
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: {
					[orderBy?.field?.toLowerCase() || 'created_at']:
						orderBy?.direction?.toLowerCase() || 'desc'
				}
			});

			const hasNextPage = posts.length > first;
			const edges = posts.slice(0, first).map(post => ({
				node: post,
				cursor: post.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.posts.count({
					where: { user_id: parent.id }
				})
			};
		}
	},

	Recipe: {
		ingredients: async (parent: any, _: any, ctx: Context) => {
			const recipeIngredients = await ctx.prisma.recipe_ingredients.findMany({
				where: { recipe_id: parent.id },
				include: { ingredient: true }
			});
			return recipeIngredients.map(ri => ({
				ingredient: ri.ingredient,
				quantity: ri.quantity,
				notes: ri.notes
			}));
		},

		hasSafeIngredientsFor: async (parent: any, args: any, ctx: Context) => {
			const { userId } = args;
			const userAllergies = await ctx.prisma.user_allergies.findMany({
				where: { user_id: userId },
				select: { allergen_id: true }
			});

			if (userAllergies.length === 0) return true;
			const allergenIds = userAllergies.map(ua => ua.allergen_id);

			const dangerousIngredients = await ctx.prisma.recipe_ingredients.count({
				where: {
					recipe_id: parent.id,
					ingredient: {
						allergen_ingredients: {
							some: {
								allergen_id: { in: allergenIds }
							}
						}
					}
				}
			});
			return dangerousIngredients === 0;
		}
	},

	Ingredient: {
		allergens: async (parent: any, _: any, ctx: Context) => {
			const allergenIngredients = await ctx.prisma.allergen_ingredients.findMany({
				where: { ingredient_id: parent.id },
				include: { allergen: true }
			});
			return allergenIngredients.map(ai => ai.allergen);
		}
	},

	Query: {
		homeFeed: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			const { first = 20, after } = args;

			const following = await ctx.prisma.follows.findMany({
				where: { follower_id: ctx.currentUserId },
				select: { followed_id: true }
			});
			const followingIds = following.map(f => f.followed_id);

			const posts = await ctx.prisma.posts.findMany({
				where: { user_id: { in: followingIds } },
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: { created_at: 'desc' }
			});

			const hasNextPage = posts.length > first;
			const edges = posts.slice(0, first).map(post => ({
				node: post,
				cursor: post.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.posts.count({
					where: { user_id: { in: followingIds } }
				})
			};
		},

		explorePosts: async (_: any, args: any, ctx: Context) => {
			const { categories, first = 20, after } = args;
			const posts = await ctx.prisma.posts.findMany({
				where: categories ? { categories: { hasSome: categories } } : {},
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: { created_at: 'desc' }
			});

			const hasNextPage = posts.length > first;
			const edges = posts.slice(0, first).map(post => ({
				node: post,
				cursor: post.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.posts.count({
					where: categories ? { categories: { hasSome: categories } } : {}
				})
			};
		},

		post: async (_: any, args: any, ctx: Context) => {
			return await ctx.prisma.posts.findUnique({ where: { id: args.id } });
		},

		searchPosts: async (_: any, args: any, ctx: Context) => {
			const { query, first = 20 } = args;
			return await ctx.prisma.posts.findMany({
				where: {
					OR: [
						{ title: { contains: query, mode: 'insensitive' } },
						{ description: { contains: query, mode: 'insensitive' } }
					]
				},
				take: first
			});
		}
	},

	Mutation: {
		createPost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			const { input } = args;

			const post = await ctx.prisma.posts.create({
				data: {
					user_id: ctx.currentUserId,
					post_type: input.postType,
					title: input.title,
					description: input.description,
					categories: input.categories
				}
			});

			if (input.mediaUrls) {
				await Promise.all(
					input.mediaUrls.map((url: string, index: number) =>
						ctx.prisma.post_media.create({
							data: {
								post_id: post.id,
								media_url: url,
								media_type: input.postType === 'VIDEO' ? 'video' : 'image',
								position: index
							}
						})
					)
				);
			}

			if (input.postType === 'RECIPE' && input.recipe) {
				await ctx.prisma.recipes.create({
					data: {
						id: post.id,
						post_id: post.id,
						name: input.recipe.name,
						description: input.recipe.description,
						steps: input.recipe.steps,
						difficulty: input.recipe.difficulty,
						time_required: input.recipe.timeRequired,
						estimated_cost: input.recipe.estimatedCost,
						servings: input.recipe.servings
					}
				});

				if (input.recipe.ingredients) {
					await Promise.all(
						input.recipe.ingredients.map((ingredient: any) =>
							ctx.prisma.recipe_ingredients.create({
								data: {
									recipe_id: post.id,
									ingredient_id: ingredient.ingredientId,
									quantity: ingredient.quantity,
									notes: ingredient.notes
								}
							})
						)
					);
				}
			}
			return post;
		},

		updatePost: async (_: any, args: any, ctx: Context) => {
			// ... simplified
			return await ctx.prisma.posts.findUnique({ where: { id: args.id } });
		},

		deletePost: async (_: any, args: any, ctx: Context) => {
			await ctx.prisma.posts.delete({ where: { id: args.id } });
			return true;
		},

		likePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			await ctx.prisma.likes.create({
				data: { user_id: ctx.currentUserId, post_id: args.postId }
			});
			// await redis.del(...)
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		unlikePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			await ctx.prisma.likes.delete({
				where: {
					user_id_post_id: { user_id: ctx.currentUserId, post_id: args.postId }
				}
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		savePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			await ctx.prisma.saved_posts.create({
				data: { user_id: ctx.currentUserId, post_id: args.postId }
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		unsavePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			await ctx.prisma.saved_posts.delete({
				where: { user_id_post_id: { user_id: ctx.currentUserId, post_id: args.postId } }
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		viewPost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			await ctx.prisma.viewed_posts.upsert({
				where: { user_id_post_id: { user_id: ctx.currentUserId, post_id: args.postId } },
				create: { user_id: ctx.currentUserId, post_id: args.postId },
				update: { viewed_at: new Date() }
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		commentOnPost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new Error('Not authenticated');
			return await ctx.prisma.comments.create({
				data: { user_id: ctx.currentUserId, post_id: args.postId, text: args.text }
			});
		},

		deleteComment: async (_: any, args: any, ctx: Context) => {
			await ctx.prisma.comments.delete({ where: { id: args.commentId } });
			return true;
		}
	}
};
